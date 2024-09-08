import styles from "./RTLTable.module.css";

interface RegisterTableProps {
  rtlLog: string[];
}

function RegisterTable({ rtlLog }: RegisterTableProps) {
  return rtlLog.length === 0 ? (
    <></>
  ) : (
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
  );
}

export default RegisterTable;
