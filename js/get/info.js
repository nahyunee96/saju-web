// info

export function 십신_천간_get(receivingStem, baseDayStem, tenGodMappingForStems) {
  return (tenGodMappingForStems[baseDayStem] && tenGodMappingForStems[baseDayStem][receivingStem]) || "-";
}
export function 십신_지지_get(receivingBranch, baseStem, tenGodMappingForBranches) {
  return (tenGodMappingForBranches[baseStem] && tenGodMappingForBranches[baseStem][receivingBranch]) || "-";
}