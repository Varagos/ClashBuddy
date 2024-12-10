import DownloadButton from "../islands/DownloadButton.tsx";

const API_KEY = Deno.env.get("COC_API_KEY");
if (!API_KEY) {
  throw new Error("Missing Clash of Clans API key");
}

const CLAN_TAG = "#2G99PVOLG";

export default function Home() {
  console.log("Hello from the Home route!");

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac] ">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="The ClashBuddy logo: a fresh, sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold text-white">Welcome to ClashBuddy</h1>
        <p class="my-4 text-white text-center">
          ClashBuddy is your go-to tool for managing and downloading your Clash
          of Clans clan data. Download the latest member details with just one
          click.
        </p>

        {/* Download Button */}
        <DownloadButton apiKey={API_KEY!} clanTag={CLAN_TAG} />
      </div>
    </div>
  );
}
