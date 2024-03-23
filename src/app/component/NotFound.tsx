'use client';
import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function NotFound() {
    let [show, setShow] = useState(false);
    setTimeout(() => {
        setShow(false);
    }, 1000
    );
    return (
        <main>
            <Dialog open={show}>
                <h1>没有找到这个网页，听听歌吧</h1>
            </Dialog>
            <MusicPlayer />
        </main>
    )
}