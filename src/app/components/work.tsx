import * as React from "react";
import { GetGenre, Work } from "../data/data";
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
        <WorkInfo work={v} option={{ ...option, hideHr: i === works.length - 1 }} key={i} />
      ))}
    </div>
  );
};

const pageP = (i: number) => {
  return i == 0 ? "" : `page_${i}`;
};

export const WorkShow = async ({ work, page }: { work: Work; page?: number }) => {
  const current = page ?? 0;
  const text = work.texts[current];
  const splited = text.split("\n\n").map((t) => t.split("\n"));
  const Pager = () => (
    <>
      {work.texts.length > 1 && (
        <div className="toc text-right mb-10">
          {current != 0 && <a href={`/${work.path}/${pageP(current - 1)}`}>{"<"}</a>}
          {work.texts
            .map((_, i) => i + 1)
            .map((i) => (
              <>
                {i > 0 && " "}
                <span className={current + 1 == i ? "underline font-bold" : ""}>
                  <a href={`/${work.path}${i > 1 ? `/page_${i - 1}` : ""}`} className="hover:no-underline">
                    {i}
                  </a>
                </span>
              </>
            ))}{" "}
          {current !== work.texts.length - 1 && <a href={`/${work.path}/${pageP(current + 1)}`}>{">"}</a>}
        </div>
      )}
    </>
  );

  return (
    <div className="mt-10 mb-10">
      <WorkInfo work={work} option={{ hideHr: true }} />
      <div className="max-w-lg mx-auto mt-20">
        <Pager />
        {splited.map((v) => (
          <p>
            {v.map((t) => (
              <>
                {t}
                <br />
              </>
            ))}
          </p>
        ))}
        <Pager />
      </div>
    </div>
  );
};

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
          <a href={"/" + genre}>
            {`❏ `} {name}
          </a>
        </p>
      )}
      <h3 className="mb-2 mt-1">
        <a href={"/" + path}>{title}</a>
      </h3>
      {!option?.hideCaption && captions && (
        <p className="pl-4 text-left text-xs my-4">
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
              <span className="mr-1">
                <a href={`/tag/${t}/`}>#{t}</a>
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
