"use client";
import React, { useState, createContext, useContext, ReactNode } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Grid,
  Box,
} from "@mui/material";
import { Home, Language, Menu } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "i18next";
import { LineChart } from "@mui/x-charts/LineChart";
import styles from "@style/common.module.scss";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        guessPlaceholder: "Enter your guess",
        guessButton: "Guess",
        formatter: "Guessed number: {c}",
        guessResultPromptRight: "Congratulations! You guessed it right!",
        guessResultPromptGt: "The number is greater than the guess.",
        guessResultPromptLt: "The number is less than the guess.",
        resetGame: "Reset Game",
      },
    },
    zh: {
      translation: {
        guessPlaceholder: "输入你的猜测",
        guessButton: "猜测",
        formatter: "猜测的数: {c}",
        guessResultPromptRight: "恭喜，你猜对了！",
        guessResultPromptGt: "猜的数大于答案。",
        guessResultPromptLt: "猜的数小于答案。",
        resetGame: "重新开始游戏",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});
interface GuessHistoryData {
  seq: number;
  data: number;
}

interface GuessItProps {}

interface LanguageContextType {
  lang: string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
});

const useLanguage = () => {
  return useContext(LanguageContext);
};

const GuessHistoryChart: React.FC<{ guessData: GuessHistoryData[] }> = ({
  guessData,
}) => {
  const xAxisData = guessData?.map((item) => item.seq) ?? [];
  const seriesData = guessData?.map((item) => item.data) ?? [];
  console.log("xAxisData", xAxisData);
  console.log("seriesData", seriesData);

  return (
    <LineChart
      xAxis={[{ data: xAxisData, tickInterval: xAxisData }]}
      series={[
        {
          data: seriesData,
          curve: "linear",
        },
      ]}
      height={300}
      margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
      grid={{ vertical: true, horizontal: true }}
    />
  );
};

const GuessIt: React.FC<GuessItProps> = () => {
  const { lang, toggleLang } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [guessSeq, updateGuessSeq] = useState<number>(0);
  const [guessNumber, setGuessNumber] = useState<number>(0);
  const [currentNumber, setCurrentNumber] = useState<number>(
    Math.round(Math.random() * 1000),
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [historyNumbers, setHistoryNumbers] = useState<GuessHistoryData[]>([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [showDialMenu, setDiaMenuOpen] = useState(false);

  const handleClose = () => {
    setDiaMenuOpen(false);
  };

  const handleOpen = () => {
    setDiaMenuOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setGuessNumber(Number(event.target.value));
  };

  const getGuessPrompt = (number: number): string => {
    if (number === currentNumber) {
      return t("guessResultPromptRight");
    } else if (number > currentNumber) {
      return t("guessResultPromptGt");
    }
    return t("guessResultPromptLt");
  };

  const handleGuess = () => {
    updateGuessSeq(guessSeq + 1);
    setShowModal(true);
    setHistoryNumbers([
      ...historyNumbers,
      { seq: guessSeq, data: guessNumber },
    ]);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setInputValue("");
    if (guessNumber === currentNumber) {
      setCurrentNumber(Math.round(Math.random() * 1000));
      setGuessNumber(0);
      setHistoryNumbers([]);
    }
  };

  const handleResetGame = () => {
    setCurrentNumber(Math.round(Math.random() * 1000));
    setGuessNumber(0);
    setHistoryNumbers([]);
    setShowModal(false);
    setInputValue("");
  };

  const handleToggleLang = () => {
    toggleLang();
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      direction="column"
      sx={{ width: "80%" }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        className={`${styles.white_background} ${styles.border_round_left_top} ${styles.border_round_right_top}`}
        sx={{ height: "80px" }}
      >
        <Grid item xs={9}>
          <Input
            value={inputValue}
            sx={{
              font: "40px",
              width: "100%",
              height: "100%",
              textAlign: "center",
              paddingLeft: "10px",
            }} // 设置文字居中
            placeholder={t("guessPlaceholder")}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            className={styles.border_round_right_top}
            onClick={handleGuess}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            {t("guessButton")}
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        className={`${styles.white_background} ${styles.border_round_left_bottom} ${styles.border_round_right_bottom}`}
        sx={{
          width: "100%",
          height: "400px",
        }}
      >
        <GuessHistoryChart guessData={historyNumbers} />
      </Grid>
      <Grid item sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <SpeedDial
          ariaLabel="Menu"
          icon={<SpeedDialIcon />}
          open={showDialMenu}
          onClose={handleClose}
          onOpen={handleOpen}
        >
          <SpeedDialAction
            icon={<Home fontSize="medium" />}
            onClick={() => {
              router.push("/");
            }}
          />
          <SpeedDialAction
            icon={<Language fontSize="medium" />}
            onClick={handleToggleLang}
          />
        </SpeedDial>
      </Grid>
      <Grid item>
        <Dialog
          open={showModal}
          onClose={handleModalClose}
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle>{getGuessPrompt(guessNumber)}</DialogTitle>
          <DialogContent>
            {guessNumber === currentNumber && (
              <Button variant="contained" onClick={handleResetGame}>
                {t("resetGame")}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState("en");

  const toggleLang = (selectedLang?: string) => {
    const newLang = selectedLang || (lang === "en" ? "zh-CN" : "en");
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <GuessIt />
    </LanguageProvider>
  );
};

export default App;
