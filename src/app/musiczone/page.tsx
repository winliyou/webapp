"use client";
import styles from "@style/common.module.scss";
import { Grid, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Home, Language } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MusicPlayer from "../component/MusicPlayer";

export default function MusicZone() {
  const router = useRouter();

  return (
    <Grid container width={"80%"}>
      <Grid
        item
        xs={9}
        className={`${styles.music_background} ${styles.music_color}`}
      >
        <MusicPlayer />
      </Grid>
      <Grid item sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <SpeedDial ariaLabel="Menu" icon={<SpeedDialIcon />}>
          <SpeedDialAction
            icon={<Home fontSize="medium" />}
            onClick={() => {
              router.push("/");
            }}
          />
        </SpeedDial>
      </Grid>
    </Grid>
  );
}
