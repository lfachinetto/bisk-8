import { useEffect, useRef } from "react";
import styles from "./LogTable.module.css";
import React from "react";

interface LogTableProps {
  rtlLog: string[];
}

function LogTable({ rtlLog }: LogTableProps) {
  const tableEndRef = useRef<HTMLDivElement>(null);

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
    <div>
      <br />
      <h3>Log de execução</h3>
      <div className={styles.tableContainer}>
        <table className={styles.logtable}>
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
                    <td className={isComment ? styles.title : styles.left}>
                      {isComment ? rtl.slice(1)+":" : rtl}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
          <div ref={tableEndRef} />
        </table>
      </div>
    </div>
  );
}

export default LogTable;
