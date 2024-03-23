"use client";

import { FeaturedPlayList, PlayArrowRounded } from "@mui/icons-material";
import Button from "@mui/material/Button/Button";
import Divider from "@mui/material/Divider/Divider";
import Grid from "@mui/material/Grid/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List/List";
import ListItem from "@mui/material/ListItem/ListItem";
import Slider from "@mui/material/Slider/Slider";
import { createRef, useEffect, useState } from "react";

interface GetPlayListReq {
  author: string;
  count: Number;
}

interface GetPlayListRespContent {
  author: string;
  title: string;
  source: string;
}
type GetPlayListResp = Array<GetPlayListRespContent>;

export default function MusicPlayer() {
  const [playListVisible, setPlayListVisible] = useState<boolean>(false);
  const [playListContent, setPlayListContent] = useState<GetPlayListResp>([]);
  const [playingSongTitle, setPlayingSongTitle] = useState<string>("");
  const [playingSongSrc, setPlayingSongSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(1);
  const audioRef = createRef<HTMLAudioElement>();

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (audioRef.current) {
      if (typeof newValue == "number") {
        let calcurrentTime = (totalDuration * newValue) / 1000;
        setCurrentTime(calcurrentTime);
        audioRef.current.currentTime = calcurrentTime;
      } else {
        let calcurrentTime = (totalDuration * newValue[activeThumb]) / 1000;

        setCurrentTime(calcurrentTime);
        audioRef.current.currentTime = calcurrentTime;
      }
    }
  };

  useEffect(() => {
    (async () => {
      fetch("http://192.168.1.118:12345/music/get_list", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: "*", count: 10 } as GetPlayListReq),
      })
        .then((response) => response.json())
        .then((data) => {
          setPlayListContent(data);
        })
        .catch((error) =>
          console.error("There was a problem with the fetch operation:", error),
        );
    })();
  }, []);

  return (
    <div>
      <audio
        autoPlay={true}
        ref={audioRef}
        style={{ display: "none" }}
        src={
          playingSongSrc === ""
            ? "https://chaoset.com/music/wish.mp3"
            : playingSongSrc
        }
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
      <Grid
        container
        alignItems={"center"}
        direction={"column"}
        marginLeft={"10px"}
      >
        {/* progress bar */}
        <Grid container direction={"row"}>
          <Grid item sx={{ minWidth: "80%" }}>
            <Slider
              max={1000}
              value={(1000 * currentTime) / totalDuration}
              onChange={handleSeek}
            />
          </Grid>
          <Grid item>{playingSongTitle}</Grid>
        </Grid>

        {/* 播放按钮 */}
        <Grid container direction={"row"}>
          <Grid item>
            {/* play button */}
            <Button
              onClick={() => {
                togglePlay();
              }}
              startIcon={<PlayArrowRounded />}
            >
              Play Arrow
            </Button>
          </Grid>

          {/* 显示播放列表的开关 */}
          <Grid item>
            {/* play list button */}
            <Button
              onClick={() => {
                setPlayListVisible(!playListVisible);
              }}
              startIcon={<FeaturedPlayList />}
            >
              Play List
            </Button>
          </Grid>
        </Grid>
        {/* 播放列表的内容 */}
        <Grid container alignItems={"flex-start"}>
          <Grid item border={"ActiveBorder"} width={"100%"}>
            {playListVisible &&
              playListContent.map((item: GetPlayListRespContent) => (
                <List
                  key={item.title}
                  onClick={() => {
                    setPlayingSongTitle(item.title);
                    setPlayingSongSrc(item.source);
                  }}
                >
                  <ListItem>
                    <Grid container>
                      <Grid item margin={"5px 8px 8px 5px"}>
                        {item.author}
                      </Grid>
                      <Grid item margin={"5px 8px 8px 5px"}>
                        {item.title}
                      </Grid>
                      <Grid item margin={"5px 8px 8px 5px"}>
                        <Link href={item.source}>{item.source}</Link>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </List>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
