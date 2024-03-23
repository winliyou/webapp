import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

let MusicPlayer = dynamic(() => import('../component/MusicPlayer'), { ssr: false });
export default function MusicZone() {
    return (
        <main>
            <MusicPlayer />
        </main>
    )
}