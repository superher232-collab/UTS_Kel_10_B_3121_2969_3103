(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/dashboard/map/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DashboardContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MapPage() {
    _s();
    const { armada } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"])();
    // State untuk menyimpan posisi dinamis kapal yang dirender ke layar
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Ref untuk menyimpan data gerak tanpa memicu re-render berlebihan (biar nggak ngelag)
    const shipsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapPage.useEffect": ()=>{
            if (!armada || armada.length === 0) return;
            // Helper untuk mendefinisikan lokasi pelabuhan dan batas rute perairan masing-masing kapal
            const getShipRouteSettings = {
                "MapPage.useEffect.getShipRouteSettings": (name, status)=>{
                    const isMoving = status?.toLowerCase().includes('perjalanan');
                    const shipName = name?.toUpperCase() || '';
                    // Default fallback
                    let x = 50;
                    let y = 50;
                    let minX = 10, maxX = 90, minY = 10, maxY = 90;
                    let vx = 0;
                    let vy = 0;
                    if (!isMoving) {
                        // Kapal sandar ditempatkan presisi di titik koordinat pelabuhan masing-masing
                        if (shipName.includes('BIMA SAKTI')) {
                            x = 30;
                            y = 72; // Tj. Priok
                        } else if (shipName.includes('SRIWIJAYA')) {
                            x = 26;
                            y = 73; // Pelabuhan Merak
                        } else if (shipName.includes('GADJAH MADA')) {
                            x = 25;
                            y = 35; // Galangan Batam
                        } else if (shipName.includes('DEWARUCI')) {
                            x = 38;
                            y = 74; // Tj. Emas / Semarang
                        } else {
                            // Fallback sandar
                            x = 45;
                            y = 75; // Tj. Perak
                        }
                    } else {
                        // Kapal berlayar bergerak di perairan (sea lane) masing-masing agar tidak asal gerak menembus pulau
                        const speed = 0.02;
                        const angle = Math.random() * Math.PI * 2;
                        vx = Math.cos(angle) * speed;
                        vy = Math.sin(angle) * speed;
                        if (shipName.includes('NUSANTARA')) {
                            // Laut Jawa -> Tanjung Perak
                            minX = 32;
                            maxX = 48;
                            minY = 56;
                            maxY = 68;
                            x = 35 + Math.random() * 10;
                            y = 58 + Math.random() * 6;
                        } else if (shipName.includes('KARTINI')) {
                            // Laut Sulawesi -> Makassar
                            minX = 58;
                            maxX = 68;
                            minY = 34;
                            maxY = 52;
                            x = 60 + Math.random() * 6;
                            y = 36 + Math.random() * 12;
                        } else if (shipName.includes('MAJAPAHIT')) {
                            // Selat Malaka -> Belawan
                            minX = 10;
                            maxX = 24;
                            minY = 14;
                            maxY = 32;
                            x = 12 + Math.random() * 8;
                            y = 16 + Math.random() * 12;
                        } else if (shipName.includes('CENDRAWASIH')) {
                            // Laut Banda -> Sorong
                            minX = 74;
                            maxX = 86;
                            minY = 48;
                            maxY = 64;
                            x = 76 + Math.random() * 8;
                            y = 50 + Math.random() * 10;
                        } else {
                            // Rute acak di laut terbuka
                            minX = 15;
                            maxX = 85;
                            minY = 15;
                            maxY = 85;
                            x = 40 + Math.random() * 20;
                            y = 40 + Math.random() * 20;
                        }
                    }
                    return {
                        x,
                        y,
                        minX,
                        maxX,
                        minY,
                        maxY,
                        vx,
                        vy
                    };
                }
            }["MapPage.useEffect.getShipRouteSettings"];
            // 1. Inisialisasi posisi awal dan "mesin" (kecepatan)
            shipsRef.current = armada.map({
                "MapPage.useEffect": (s)=>{
                    const settings = getShipRouteSettings(s.name, s.status);
                    const isMoving = s.status?.toLowerCase().includes('perjalanan');
                    return {
                        ...s,
                        x: settings.x,
                        y: settings.y,
                        minX: settings.minX,
                        maxX: settings.maxX,
                        minY: settings.minY,
                        maxY: settings.maxY,
                        vx: settings.vx,
                        vy: settings.vy,
                        statusText: s.status,
                        statusColor: isMoving ? '#22C55E' : s.status?.toLowerCase().includes('pelabuhan') ? '#3B82F6' : '#EF4444'
                    };
                }
            }["MapPage.useEffect"]);
            setPositions(shipsRef.current);
            // 2. Bikin fungsi loop animasi gerak
            const tick = {
                "MapPage.useEffect.tick": ()=>{
                    shipsRef.current = shipsRef.current.map({
                        "MapPage.useEffect.tick": (ship)=>{
                            // Kalo lagi sandar atau rusak, diem di tempat
                            if (ship.vx === 0 && ship.vy === 0) return ship;
                            let nx = ship.x + ship.vx;
                            let ny = ship.y + ship.vy;
                            let nvx = ship.vx;
                            let nvy = ship.vy;
                            // Bouncing di batas koridor pelayaran masing-masing
                            if (nx < ship.minX || nx > ship.maxX) nvx = -nvx;
                            if (ny < ship.minY || ny > ship.maxY) nvy = -nvy;
                            // Clamp agar tidak merayap keluar dari koridor perairan
                            nx = Math.max(ship.minX, Math.min(ship.maxX, nx));
                            ny = Math.max(ship.minY, Math.min(ship.maxY, ny));
                            return {
                                ...ship,
                                x: nx,
                                y: ny,
                                vx: nvx,
                                vy: nvy
                            };
                        }
                    }["MapPage.useEffect.tick"]);
                    // Update state buat geser posisi UI
                    setPositions([
                        ...shipsRef.current
                    ]);
                    // Panggil diri sendiri buat frame berikutnya
                    animRef.current = requestAnimationFrame(tick);
                }
            }["MapPage.useEffect.tick"];
            // Jalankan mesin animasi
            animRef.current = requestAnimationFrame(tick);
            // Bersihkan memori (cleanup) kalau user pindah tab
            return ({
                "MapPage.useEffect": ()=>cancelAnimationFrame(animRef.current)
            })["MapPage.useEffect"];
        }
    }["MapPage.useEffect"], [
        armada
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            color: 'white',
            fontFamily: 'monospace'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--bg-card, #130a24)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '4px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '12px',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            },
                            children: "PELACAKAN ARMADA GLOBAL"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#0a0510',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '4px',
                            height: '500px',
                            position: 'relative',
                            overflow: 'hidden'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(20, 10, 36, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    zIndex: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '6px',
                                            height: '6px',
                                            background: '#22C55E',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 8px #22C55E',
                                            animation: 'pulse 1.5s infinite'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '10px',
                                            color: '#22C55E',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.5px'
                                        },
                                        children: "LIVE TRACKING"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    bottom: '16px',
                                    left: '16px',
                                    background: 'rgba(20, 10, 36, 0.8)',
                                    border: '1px solid rgba(168, 85, 247, 0.2)',
                                    padding: '16px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    zIndex: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-muted, #8B7BA8)',
                                            letterSpacing: '1px'
                                        },
                                        children: "LEGENDA"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '8px',
                                                    height: '8px',
                                                    background: '#22C55E',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 0 8px #22C55E'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'white'
                                                },
                                                children: "Dalam Perjalanan"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '8px',
                                                    height: '8px',
                                                    background: '#3B82F6',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 0 8px #3B82F6'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'white'
                                                },
                                                children: "Di Pelabuhan / Sandar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '8px',
                                                    height: '8px',
                                                    background: '#EF4444',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 0 8px #EF4444'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'white'
                                                },
                                                children: "Pemeliharaan / Perawatan"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "100%",
                                height: "100%",
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                                id: "grid",
                                                width: "40",
                                                height: "40",
                                                patternUnits: "userSpaceOnUse",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M 40 0 L 0 0 0 40",
                                                    fill: "none",
                                                    stroke: "rgba(168, 85, 247, 0.05)",
                                                    strokeWidth: "1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                                id: "cyber-glow",
                                                x: "-20%",
                                                y: "-20%",
                                                width: "140%",
                                                height: "140%",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                                        stdDeviation: "3",
                                                        result: "blur"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                                in: "blur"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                                lineNumber: 185,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                                in: "SourceGraphic"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        width: "100%",
                                        height: "100%",
                                        fill: "url(#grid)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        opacity: "0.75",
                                        style: {
                                            pointerEvents: 'none'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 5 15 L 20 22 L 25 36 L 17 40 L 9 30 L 5 17 Z",
                                                fill: "rgba(168, 85, 247, 0.03)",
                                                stroke: "rgba(168, 85, 247, 0.25)",
                                                strokeWidth: "1.5",
                                                filter: "url(#cyber-glow)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "11%",
                                                y: "26%",
                                                fill: "rgba(168, 85, 247, 0.3)",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                letterSpacing: "1px",
                                                children: "SUMATERA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 23 71 L 41 73 L 55 75 L 53 79 L 37 77 L 23 74 Z",
                                                fill: "rgba(168, 85, 247, 0.03)",
                                                stroke: "rgba(168, 85, 247, 0.25)",
                                                strokeWidth: "1.5",
                                                filter: "url(#cyber-glow)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "35%",
                                                y: "82%",
                                                fill: "rgba(168, 85, 247, 0.3)",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                letterSpacing: "1px",
                                                children: "JAWA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 35 30 L 45 23 L 53 26 L 55 40 L 47 48 L 37 44 L 34 36 Z",
                                                fill: "rgba(168, 85, 247, 0.03)",
                                                stroke: "rgba(168, 85, 247, 0.25)",
                                                strokeWidth: "1.5",
                                                filter: "url(#cyber-glow)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "40%",
                                                y: "36%",
                                                fill: "rgba(168, 85, 247, 0.3)",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                letterSpacing: "1px",
                                                children: "KALIMANTAN"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 61 36 L 73 36 L 73 40 L 67 43 L 74 50 L 71 54 L 65 50 L 63 56 L 60 56 L 62 46 L 58 42 Z",
                                                fill: "rgba(168, 85, 247, 0.03)",
                                                stroke: "rgba(168, 85, 247, 0.25)",
                                                strokeWidth: "1.5",
                                                filter: "url(#cyber-glow)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "63%",
                                                y: "46%",
                                                fill: "rgba(168, 85, 247, 0.3)",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                letterSpacing: "1px",
                                                children: "SULAWESI"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 83 46 L 91 44 L 97 50 L 97 60 L 91 62 L 87 54 L 80 52 Z",
                                                fill: "rgba(168, 85, 247, 0.03)",
                                                stroke: "rgba(168, 85, 247, 0.25)",
                                                strokeWidth: "1.5",
                                                filter: "url(#cyber-glow)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 211,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "86%",
                                                y: "54%",
                                                fill: "rgba(168, 85, 247, 0.3)",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                letterSpacing: "1px",
                                                children: "PAPUA"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, this),
                                            [
                                                {
                                                    name: 'Belawan',
                                                    x: 15,
                                                    y: 20
                                                },
                                                {
                                                    name: 'Batam',
                                                    x: 25,
                                                    y: 35
                                                },
                                                {
                                                    name: 'Merak',
                                                    x: 26,
                                                    y: 73
                                                },
                                                {
                                                    name: 'Tj. Priok',
                                                    x: 30,
                                                    y: 72
                                                },
                                                {
                                                    name: 'Tj. Emas',
                                                    x: 38,
                                                    y: 74
                                                },
                                                {
                                                    name: 'Tj. Perak',
                                                    x: 45,
                                                    y: 75
                                                },
                                                {
                                                    name: 'Makassar',
                                                    x: 65,
                                                    y: 55
                                                },
                                                {
                                                    name: 'Sorong',
                                                    x: 82,
                                                    y: 48
                                                }
                                            ].map((port)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: `${port.x}%`,
                                                            cy: `${port.y}%`,
                                                            r: "3",
                                                            fill: "#A855F7",
                                                            opacity: "0.8"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: `${port.x}%`,
                                                            cy: `${port.y}%`,
                                                            r: "6",
                                                            fill: "none",
                                                            stroke: "#A855F7",
                                                            strokeWidth: "0.5",
                                                            opacity: "0.4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                            x: `${port.x + 1.2}%`,
                                                            y: `${port.y + 1}%`,
                                                            fill: "rgba(139, 123, 168, 0.6)",
                                                            fontSize: "7px",
                                                            style: {
                                                                pointerEvents: 'none'
                                                            },
                                                            children: port.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, port.name, true, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this),
                                    positions.map((ship, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            className: "ship-node",
                                            children: [
                                                ship.vx !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: `${ship.x}%`,
                                                    cy: `${ship.y}%`,
                                                    r: "12",
                                                    fill: "none",
                                                    stroke: ship.statusColor,
                                                    strokeWidth: "1",
                                                    opacity: "0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                                            attributeName: "r",
                                                            values: "6; 25; 6",
                                                            dur: "2.5s",
                                                            repeatCount: "indefinite"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                                            attributeName: "opacity",
                                                            values: "0.6; 0; 0.6",
                                                            dur: "2.5s",
                                                            repeatCount: "indefinite"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: `${ship.x}%`,
                                                    cy: `${ship.y}%`,
                                                    r: "5",
                                                    fill: ship.statusColor,
                                                    style: {
                                                        filter: 'drop-shadow(0px 0px 4px ' + ship.statusColor + ')'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: `${ship.x}%`,
                                                    cy: `${ship.y}%`,
                                                    r: "10",
                                                    fill: ship.statusColor,
                                                    opacity: "0.15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                    x: `${ship.x + 1.5}%`,
                                                    y: `${ship.y - 1.5}%`,
                                                    fill: "rgba(255,255,255,0.9)",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    style: {
                                                        pointerEvents: 'none',
                                                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                                    },
                                                    children: ship.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                    x: `${ship.x + 1.5}%`,
                                                    y: `${ship.y + 2.5}%`,
                                                    fill: ship.statusColor,
                                                    fontSize: "8px",
                                                    style: {
                                                        pointerEvents: 'none',
                                                        fontWeight: 'bold'
                                                    },
                                                    children: ship.vx !== 0 ? '▶ Bergerak' : ship.statusText?.includes('PEMELIHARAAN') ? '🛠 Perawatan' : '⚓ Sandar'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/map/page.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, ship.id || index, true, {
                                            fileName: "[project]/src/app/dashboard/map/page.tsx",
                                            lineNumber: 237,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/map/page.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/map/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/map/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/map/page.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/map/page.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(MapPage, "N/yJ95GX+/mVYEiIN/pOT0W2V1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"]
    ];
});
_c = MapPage;
var _c;
__turbopack_context__.k.register(_c, "MapPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_dashboard_map_page_tsx_0pxjo5_._.js.map