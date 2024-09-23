import { useEffect, useRef } from "react";
import styles from "./RTLTable.module.css";

interface RegisterTableProps {
  rtlLog: string[];
}

function RegisterTable({ rtlLog }: RegisterTableProps) {
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
    <>
      <center>
        <div className={styles.rtlContainer}>
          <table>
            <thead>
              <tr>
                <th>RTL</th>
              </tr>
            </thead>
            <tbody>
              {rtlLog.map((rtl, i) => {
                const isComment = rtl.slice(0, 1) == "#";
                return (
                  <>
                    {isComment && i > 0 ? (
                      <tr key={Math.random()}>
                        <td />
                      </tr>
                    ) : (
                      <></>
                    )}
                    <tr key={Math.random()}>
                      <td className={isComment ? styles.title : ""}>
                        {isComment ? rtl.slice(1) : rtl}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
          <div ref={tableEndRef} />
        </div>
      </center>
    </>
  );
}

export default RegisterTable;
