import { useEffect, useRef } from "react";
import styles from "./LogTable.module.css";
import React from "react";

interface LogTableProps {
  rtlLog: string[];
}

function LogTable({ rtlLog }: LogTableProps) {
  const tableEndRef = useRef<HTMLTableCellElement>(null);

  const scrollToEnd = () => {
    if (tableEndRef.current) {
      tableEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, [rtlLog]);

  return rtlLog.length === 0 ? (
    <></>
  ) : (
    <table className={styles.logtable}>
      <caption>Log de execução</caption>
      <tbody>
        {rtlLog.map((rtl, i) => {
          const isComment = rtl.slice(0, 1) == "#";
          return (
            <React.Fragment key={i}>
              {/* {isComment && i > 0 ? (
                    <tr>
                      <td />
                    </tr>
                  ) : (
                    ""
                  )} */}
              <tr>
                <td className={isComment ? styles.title : ""}>
                  {isComment ? rtl.slice(1) + ":" : rtl}
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
      <tfoot>
        <tr><td ref={tableEndRef}>Invisible! Just for scrolling</td></tr>
      </tfoot>
    </table>
  );
}

export default LogTable;
