import * as React from "react";
import { GetGenre, Work } from "../data/data";
import Link from "next/link";
import dayjs from "dayjs";

export const WorkInfoList = async ({
  works,
  option,
}: {
  works: Work[];
  option?: { hideGenre?: boolean; hideCaption?: boolean };
}) => {
  return (
    <div className="mt-10">
      {works.map((v, i) => (
        <WorkInfo work={v} option={{ ...option, hideHr: i === works.length - 1 }} />
      ))}
    </div>
  );
};

export const WorkShow = async ({work} : {work: Work}) => {
  const text = work.texts.map(v => v.split("\n\n").map(t => t.split("\n")))
  return (
    <>
    <WorkInfo work={work} option={{hideHr: true}}/>
    <div className="max-w-xl">{}</div>
    </>
  )
}

export const WorkInfo = async ({
  work,
  option,
}: {
  work: Work;
  option?: { hideGenre?: boolean; hideCaption?: boolean; hideHr?: boolean };
}) => {
  const { path, title, caption, tag, date, genre } = work;
  const { name } = await GetGenre(genre);

  const captions = caption?.split("\n");
  return (
    <div className="mx-auto mt-4 mb-8 max-w-xl last:border-non">
      {option?.hideGenre ? (
        <></>
      ) : (
        <p className="mb-0 mt-0 text-xs">
          <Link href={"/" + genre}>
            {`❏ `} {name}
          </Link>
        </p>
      )}
      <h3 className="mb-2 mt-1">
        <Link href={"/" + path}>{title}</Link>
      </h3>
      {!option?.hideCaption && captions && (
        <p className="pl-4 text-left text-xs">
          {captions.map((v, i) => {
            return (
              <>
                {i !== 0 && <br />}
                {v}
              </>
            );
          })}
        </p>
      )}
      <div className="text-right text-xs">
        {tag && (
          <div className="mb-0 mt-0">
            {tag.map((t) => (
              <span>
                {" "}
                <Link href={t}>#{t}</Link>
              </span>
            ))}
          </div>
        )}
        <p className="mb-0 mt-0">{dayjs(date).format("YYYY年M月DD日")}</p>
        {!option?.hideHr && <hr></hr>}
      </div>
    </div>
  );
};
