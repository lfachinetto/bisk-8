import { useEffect, useRef } from "react";
import styles from "./RTLTable.module.css";
import React from "react";

interface RTLTableProps {
  rtlLog: string[];
}

function RTLTable({ rtlLog }: RTLTableProps) {
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
    <center>
      <div className={styles.tableContainer}>
        <table>
          <tbody>
            {rtlLog.map((rtl, i) => {
              const isComment = rtl.slice(0, 1) == "#";
              return (
                <React.Fragment key={i}>
                  {isComment && i > 0 ? (
                    <tr key={i + "-1"}>
                      <td />
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr key={i + "-2"}>
                    <td className={isComment ? styles.title : ""}>
                      {isComment ? rtl.slice(1) : rtl}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div ref={tableEndRef} />
      </div>
    </center>
  );
}

export default RTLTable;
