import { ProgramPatch, ProgramPatchType, TranslateNodePatch } from "./ProgramPatch";

export default function combinePatches(patches: ProgramPatch[]): ProgramPatch[] {
    let translatePatches: { [nodeId: string]: TranslateNodePatch } = {};

    const retVal: ProgramPatch[] = [];

    patches.forEach((patch) => {
        switch (patch.type) {
            case ProgramPatchType.TRANSLATE_NODE:
                if (!translatePatches[patch.node]) {
                    translatePatches[patch.node] = patch;
                } else {
                    translatePatches[patch.node].payload.x += patch.payload.x;
                    translatePatches[patch.node].payload.y += patch.payload.y;
                }
                break;
            default:
                retVal.push(patch);
        }
    });

    Object.values(translatePatches).forEach((patch) => {
        retVal.push(patch);
    });

    return retVal;
}
