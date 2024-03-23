'use client';
import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { Button, Input, Dialog, DialogContent, DialogTitle, SpeedDial, SpeedDialAction, SpeedDialIcon, Grid, Box } from '@mui/material';
import { Home, Language, Menu } from '@mui/icons-material';
import * as echarts from 'echarts';
import { useRouter } from 'next/navigation';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from "i18next";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: {
                    "guessPlaceholder": "Enter your guess",
                    "guessButton": "Guess"
                }
            },
            zh: {
                translation: {
                    "guessPlaceholder": "输入你的猜测",
                    "guessButton": "猜测"
                }
            }
        },
        lng: "en",
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });
interface GuessHistoryData {
    seq: number;
    data: number;
}

interface GuessItProps { }

interface LanguageContextType {
    lang: string;
    toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    toggleLang: () => { },
});

const useLanguage = () => {
    return useContext(LanguageContext);
};

const GuessHistoryChart: React.FC<{ data: GuessHistoryData[], lang: string }> = ({ data, lang }) => {
    useEffect(() => {
        const chart = echarts.init(document.getElementById('chart') as HTMLDivElement);
        chart.setOption({
            xAxis: {
                type: 'category',
                data: data.map(item => item.seq),
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'axis',
                formatter: lang === 'zh-CN' ? '猜测的数: {c}' : 'Guessed number: {c}'
            },
            series: [{
                data: data.map(item => item.data),
                type: 'line'
            }]
        });

        return () => {
            chart.dispose();
        };
    }, [data, lang]);

    return <div id="chart" style={{ width: '100%', height: '400px', background: "white" }}></div>;
};

const GuessIt: React.FC<GuessItProps> = () => {
    const { lang, toggleLang } = useLanguage();
    const [inputValue, setInputValue] = useState("");
    const [guessSeq, updateGuessSeq] = useState<number>(0);
    const [guessNumber, setGuessNumber] = useState<number>(0);
    const [currentNumber, setCurrentNumber] = useState<number>(Math.round(Math.random() * 1000));
    const [showModal, setShowModal] = useState<boolean>(false);
    const [historyNumbers, setHistoryNumbers] = useState<GuessHistoryData[]>([]);
    const router = useRouter();
    const { t } = useTranslation();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setGuessNumber(Number(event.target.value));
    };

    const getMessage = (number: number) => {
        switch (lang) {
            case "zh-CN":
                return number === currentNumber ? "恭喜，你猜对了！" : "猜错了，请继续猜。";
            default:
                return number === currentNumber ? "Congratulations! You guessed it right!" : "Wrong guess! Please try again.";
        }
    };

    const handleGuess = () => {
        updateGuessSeq(guessSeq + 1);
        setShowModal(true);
        setHistoryNumbers([...historyNumbers, { seq: guessSeq, data: guessNumber }]);
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
        <Grid container justifyContent="center" alignItems="center" alignContent="center" direction="column" width={"80%"}>
            <Grid container direction="row" justifyContent="center" alignItems='stretch' height={"80px"} style={{ backgroundColor: 'white' }}>
                <Grid item xs={9} >
                    <Input
                        value={inputValue}
                        style={{ font: "40px", width: '100%', height: "100%", textAlign: 'center', paddingLeft: "10px" }} // 设置文字居中
                        placeholder={t('guessPlaceholder')}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleGuess}
                        style={{
                            width: '100%',
                            height: '100%', // 设置高度为 100%
                        }}
                    >
                        {t('guessButton')}
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ width: '100%', height: 'inherit' }}>
                <GuessHistoryChart data={historyNumbers} lang={lang} />
            </Grid>
            <Grid item style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <SpeedDial
                    ariaLabel="SpeedDial openIcon example"
                    icon={<SpeedDialIcon openIcon={<Menu fontSize="medium" />}
                    />}
                >
                    <SpeedDialAction icon={<Home fontSize="medium" />} onClick={() => { router.push("/") }} />
                    <SpeedDialAction icon={<Language fontSize="medium" />} onClick={handleToggleLang} />
                </SpeedDial>
            </Grid>
            <Grid item>
                <Dialog open={showModal} onClose={handleModalClose} maxWidth="md" fullWidth={true}>
                    <DialogTitle style={{ backgroundColor: 'white' }}>{getMessage(guessNumber)}</DialogTitle>
                    <DialogContent style={{ backgroundColor: 'white' }}>
                        {guessNumber === currentNumber && <Button variant="contained" onClick={handleResetGame}>{t('resetButton')}</Button>}
                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid >
    );
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState('en');

    const toggleLang = (selectedLang?: string) => {
        const newLang = selectedLang || (lang === 'en' ? 'zh-CN' : 'en');
        setLang(newLang);
        i18n.changeLanguage(newLang); // 更新 i18next 的语言设置
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