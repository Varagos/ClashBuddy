import { useSignal } from "@preact/signals";
import { Input } from "../components/Input.tsx";
import { Button } from "../components/Button.tsx";
import { clanTag } from "../signals/clanTag.ts";

interface ClanTagInputProps {
  onTagChange?: (newTag: string) => void;
}

export default function ClanTagInput(props: ClanTagInputProps) {
  // Create signal for clanTag, initially set to the defaultTag prop
  // const clanTag = useSignal(props.defaultTag);

  const handleSave = () => {
    console.log("Clan Tag saved:", clanTag.value);
    if (props.onTagChange) props.onTagChange(clanTag.value);
  };

  return (
    <div class="flex flex-row items-center gap-2 my-4">
      <Input
        type="text"
        value={clanTag.value}
        onInput={(e) => clanTag.value = e.currentTarget.value}
        class="w-40 text-center bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
      />
      <Button
        onClick={handleSave}
        class="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
      >
        💾 Save
      </Button>
    </div>
  );
}
