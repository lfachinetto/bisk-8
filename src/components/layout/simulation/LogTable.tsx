import { useEffect, useRef } from "react";
import styles from "./LogTable.module.css";
import React from "react";

interface LogTableProps {
  rtlLog: string[];
}

function LogTable({ rtlLog }: LogTableProps) {
  const lastRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    lastRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [rtlLog]);

  if (rtlLog.length === 0) return null;

  return (
    <table className={styles.logtable}>
      <caption>Log de execução</caption>
      <tbody>
        {rtlLog.map((rtl, i) => {
          const isComment = rtl.slice(0, 1) == "#";
          const isLast = i === rtlLog.length - 1;
          return (
            <React.Fragment key={i}>
              <tr ref={isLast ? lastRowRef : undefined}>
                <td className={isComment ? styles.title : ""}>
                  {isComment ? rtl.slice(1) + ":" : rtl}
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default LogTable;
