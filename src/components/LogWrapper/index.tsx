"use client";

import "highlight.js/styles/atom-one-dark.min.css";
// import "highlight.js/styles/atom-one-light.min.css";

import { useEffect } from "react";
import hljs from "highlight.js";
import { LineNumber } from "./plugins";

type Props = {
  code?: string;
};

export const LogWrapper: React.FC<Props> = ({ code = "" }) => {
  useEffect(() => {
    hljs.addPlugin(LineNumber);
    hljs.highlightAll();

    return () => {
      hljs.removePlugin(LineNumber);
    };
  }, []);

  return (
    <pre
      className="theme-atom-one-dark dark:bg-transparent"
      // style={{ tabSize: 4 }}
    >
      <code className="language-prolog p-2 !pr-0 text-sm dark:bg-transparent">
        {code}
      </code>
    </pre>
  );
};
