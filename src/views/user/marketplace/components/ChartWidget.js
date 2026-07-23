import React, { useEffect, useRef } from "react";
import { useColorModeValue } from "@chakra-ui/react";

const TradingViewWidget = ({ height = "400px" }) => {
    const containerRef = useRef(null);
    const widgetColor = useColorModeValue("light", "dark");

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = "";

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src =
                "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";

            script.innerHTML = JSON.stringify({
                colorTheme: widgetColor,
                dateRange: "12M",
                showChart: true,
                locale: "en",
                largeChartUrl: "",
                isTransparent: false,
                showSymbolLogo: true,
                showFloatingTooltip: false,
                width: "100%",
                height: "45%", // allow it to fill the parent container
                plotLineColorGrowing: "rgba(41, 98, 255, 1)",
                plotLineColorFalling: "rgba(41, 98, 255, 1)",
                gridLineColor: "rgba(240, 243, 250, 0)",
                scaleFontColor: "rgba(15, 15, 15, 1)",
                belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
                belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
                belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
                belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
                symbolActiveColor: "rgba(41, 98, 255, 0.12)",
                tabs: [
                    {
                        title: "Indices",
                        symbols: [
                            { s: "COINBASE:ETHUSD", d: "ETH scan" },
                            { s: "BINANCE:BTCUSDT", d: "BTC scan" },
                            { s: "FOREXCOM:SPXUSD", d: "S&P 500 Index" },
                            { s: "FOREXCOM:NSXUSD", d: "US 100 Cash CFD" },
                            { s: "FOREXCOM:DJI", d: "Dow Jones Industrial Average Index" },
                            { s: "INDEX:NKY", d: "Japan 225" },
                            { s: "INDEX:DEU40", d: "DAX Index" },
                            { s: "FOREXCOM:UKXGBP", d: "FTSE 100 Index" }
                        ],
                        originalTitle: "Indices"
                    }
                ]
            });

            const scriptWrapper = document.createElement("div");
            scriptWrapper.className = "tradingview-widget-container__widget";
            scriptWrapper.style.width = "100%";
            scriptWrapper.style.height = "100%";

            containerRef.current.className = "tradingview-widget-container";
            containerRef.current.appendChild(scriptWrapper);
            containerRef.current.appendChild(script);
        }
    }, [widgetColor]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "420px",
                borderRadius: "12px",
                overflow: "hidden"
            }}
        />
    );
};

export default TradingViewWidget;
