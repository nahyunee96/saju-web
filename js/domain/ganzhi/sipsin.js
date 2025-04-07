
import { 천간_십신_매핑, 지지_십신_매핑 } from '../constants.js';

export function 일간에_따른_천간_십신_출력(receivingStem, 일간, 천간_십신_매핑) {
  return (천간_십신_매핑[일간] && 천간_십신_매핑[일간][receivingStem]) || "-";
}
export function 일간에_따른_지지_십신_출력(receivingBranch, baseStem, 지지_십신_매핑) {
  return (지지_십신_매핑[baseStem] && 지지_십신_매핑[baseStem][receivingBranch]) || "-";
}