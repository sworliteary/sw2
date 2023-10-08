import dayjs from "dayjs";
const timezone = require("dayjs/plugin/timezone");
import * as fs from "fs/promises";
import { glob } from "glob";
const path = require("path");

dayjs.extend(timezone);

type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
  works: Work[];
  series: Series[];
};

type WorkInfo = {
  title: string;
  author: string;
  caption: string;
  tag: string[];
  date: string;
  files?: string[];
};

type Work = {
  title: string;
  author: string;
  caption: string;
  tag: string[];
  date: dayjs.Dayjs;
  texts: string[];
  path: string;
  genre: string; // ジャンルへのパス
};

type Series = {
  name: string;
  description: string;
  works: string[];
  genre: string; // ジャンルへのパス
};

const findGenres = async (root: string): Promise<Genre[]> => {
  const genres = new Array<Genre>();
  const genreFiles = await glob(root + "/**/genre.json");
  for (const p of genreFiles) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString());
    const genre = { ...info, path: path.dirname(p) } as Genre;
    genres.push(genre);
  }
  return genres;
};

const findSeries = async (dir: string) => {
  const jsons = await glob(dir + "/**/series.json");
  const serieses = new Array<Series>();
  for (const p of jsons) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString());
    const works = await findWorks(path.dirname(p));
    serieses.push({ ...info, works: works.map((v) => v.path), genre: dir });
  }
  return serieses;
};

const findWorks = async (parent: string) => {
  const workFiles = await glob(parent + "/**/work.json");
  const works = new Array<Work>();
  for (const p of workFiles) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString()) as WorkInfo;
    const texts = new Array<string>();
    const dir = path.dirname(p);
    for (const t of info.files ?? ["text.txt"]) {
      const text = (await fs.readFile(path.join(dir, t))).toString();
      if (text.split("\n").length > 3) {
        texts.push(text);
      } else {
        // シンボリックリンクが壊れてファイルのパスを一行記述したファイルになることがあるので、その時の対策
        texts.push((await fs.readFile(path.join(dir, text))).toString());
      }
    }
    const work = { ...info, date: dayjs(info.date, "YYYY/MM/DD"), path: dir, texts, genre: parent } as Work;
    works.push(work);
  }
  return works;
};

const toSnakeCase = (camel: string): string => {
  return camel
    ? camel
        .split("/")
        .map((v) =>
          v.replace(/[A-Z]/g, (letter, index) => (index == 0 ? letter.toLowerCase() : "_" + letter.toLowerCase()))
        )
        .join("/")
    : "";
};

const normalizePath = (path: string, root: string): string => {
  return toSnakeCase(path.split(root)[1]);
};

const normalize = (obj: { path?: string; genre?: string }, root: string) => {
  if (obj.path) obj.path = normalizePath(obj.path, root);
  if (obj.genre) obj.genre = normalizePath(obj.genre, root);
  return obj;
};

const normalizePaths = (paths: { path?: string; genre?: string }[], root: string) => {
  return paths.map((p) => normalize(p, root));
};

const main = async (args: string[]) => {
  const root = args[args.length - 1].endsWith("/") ? args[args.length - 1] : args[args.length - 1] + "/";
  const genres = await findGenres(args[args.length - 1]);
  for (const genre of genres) {
    const works = (await findWorks(genre.path)).sort((a, b) => (a.date.isAfter(b.date) ? -1 : 1));
    const series = await findSeries(genre.path);
    const obj = {
      ...normalize(genre, root),
      works: normalizePaths(works, root),
      series: series.map((v) => {
        return { ...normalize(v, root), works: v.works.map((v) => normalizePath(v, root)) };
      }),
    };
    await fs.mkdir(path.join("dist/", path.dirname(genre.path)), { recursive: true }).catch((v) => {
      if (v.code === "EXISTS") return;
      else throw v;
    });
    await fs.writeFile("dist/" + genre.path + ".json", JSON.stringify(obj, null, 2));
  }
  await fs.writeFile("dist/genre.json", JSON.stringify(genres, null, 2));
};

main(process.argv);
