import * as Preact from "https://cdn.jsdelivr.net/npm/preact@10.26.4/+esm";
export {
  useState,
  useRef,
  useEffect,
} from "https://cdn.jsdelivr.net/npm/preact@10.26.4/hooks/+esm";
import htm from "https://cdn.jsdelivr.net/npm/htm@3.1.1/+esm";

export const h = htm.bind(Preact.h);
export const render = Preact.render;
