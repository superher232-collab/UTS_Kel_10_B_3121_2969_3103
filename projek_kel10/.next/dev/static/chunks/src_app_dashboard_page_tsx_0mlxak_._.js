(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RingkasanDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DashboardContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function DashboardContent() {
    _s();
    const { role, cuaca, updateCuaca, armada } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const filter = searchParams.get('filter') || 'semua';
    // State posisi kapal — diinisialisasi dari armada
    const [positions, setPositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const animRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Inisialisasi posisi awal + arah gerak tiap kapal
    const shipsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            if (armada.length === 0) return;
            // Helper untuk mendefinisikan lokasi pelabuhan dan batas rute perairan masing-masing kapal (Skala 900x460)
            const getShipRouteSettings = {
                "DashboardContent.useEffect.getShipRouteSettings": (name, status)=>{
                    const isMoving = status?.toLowerCase().includes('perjalanan');
                    const shipName = name?.toUpperCase() || '';
                    // Default fallback (persentase awal)
                    let x = 50;
                    let y = 50;
                    let minX = 10, maxX = 90, minY = 10, maxY = 90;
                    let vx = 0;
                    let vy = 0;
                    if (!isMoving) {
                        // Kapal sandar ditempatkan presisi di koordinat pelabuhan masing-masing
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
                            y = 74; // Tj. Emas
                        } else {
                            x = 45;
                            y = 75; // Tj. Perak
                        }
                    } else {
                        // Kapal berlayar bergerak di perairan (sea lane) masing-masing
                        const speed = 0.15; // Kecepatan skala absolut radar
                        const angle = Math.random() * Math.PI * 2;
                        vx = Math.cos(angle) * speed;
                        vy = Math.sin(angle) * speed;
                        if (shipName.includes('NUSANTARA')) {
                            minX = 32;
                            maxX = 48;
                            minY = 56;
                            maxY = 68;
                            x = 35 + Math.random() * 10;
                            y = 58 + Math.random() * 6;
                        } else if (shipName.includes('KARTINI')) {
                            minX = 58;
                            maxX = 68;
                            minY = 34;
                            maxY = 52;
                            x = 60 + Math.random() * 6;
                            y = 36 + Math.random() * 12;
                        } else if (shipName.includes('MAJAPAHIT')) {
                            minX = 10;
                            maxX = 24;
                            minY = 14;
                            maxY = 32;
                            x = 12 + Math.random() * 8;
                            y = 16 + Math.random() * 12;
                        } else if (shipName.includes('CENDRAWASIH')) {
                            minX = 74;
                            maxX = 86;
                            minY = 48;
                            maxY = 64;
                            x = 76 + Math.random() * 8;
                            y = 50 + Math.random() * 10;
                        } else {
                            minX = 15;
                            maxX = 85;
                            minY = 15;
                            maxY = 85;
                            x = 40 + Math.random() * 20;
                            y = 40 + Math.random() * 20;
                        }
                    }
                    // Konversi skala persen ke koordinat absolut Radar (900 x 460)
                    return {
                        x: x * 9,
                        y: y * 4.6,
                        minX: minX * 9,
                        maxX: maxX * 9,
                        minY: minY * 4.6,
                        maxY: maxY * 4.6,
                        vx,
                        vy
                    };
                }
            }["DashboardContent.useEffect.getShipRouteSettings"];
            shipsRef.current = armada.map({
                "DashboardContent.useEffect": (ship)=>{
                    const settings = getShipRouteSettings(ship.name, ship.status);
                    const isMoving = ship.status?.toLowerCase().includes('perjalanan');
                    return {
                        id: ship.id,
                        name: ship.name,
                        status: isMoving ? 'berlayar' : 'sandar',
                        x: settings.x,
                        y: settings.y,
                        minX: settings.minX,
                        maxX: settings.maxX,
                        minY: settings.minY,
                        maxY: settings.maxY,
                        vx: settings.vx,
                        vy: settings.vy
                    };
                }
            }["DashboardContent.useEffect"]);
            setPositions(shipsRef.current.map({
                "DashboardContent.useEffect": (s)=>({
                        id: s.id,
                        x: s.x,
                        y: s.y,
                        name: s.name,
                        status: s.status
                    })
            }["DashboardContent.useEffect"]));
            // Animasi loop
            const tick = {
                "DashboardContent.useEffect.tick": ()=>{
                    shipsRef.current = shipsRef.current.map({
                        "DashboardContent.useEffect.tick": (ship)=>{
                            if (ship.status !== 'berlayar') return ship;
                            let nx = ship.x + ship.vx;
                            let ny = ship.y + ship.vy;
                            let nvx = ship.vx;
                            let nvy = ship.vy;
                            // Bouncing di batas koridor pelayaran masing-masing
                            if (nx < ship.minX || nx > ship.maxX) nvx = -nvx;
                            if (ny < ship.minY || ny > ship.maxY) nvy = -nvy;
                            // Clamp
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
                    }["DashboardContent.useEffect.tick"]);
                    setPositions(shipsRef.current.map({
                        "DashboardContent.useEffect.tick": (s)=>({
                                id: s.id,
                                x: s.x,
                                y: s.y,
                                name: s.name,
                                status: s.status
                            })
                    }["DashboardContent.useEffect.tick"]));
                    animRef.current = requestAnimationFrame(tick);
                }
            }["DashboardContent.useEffect.tick"];
            animRef.current = requestAnimationFrame(tick);
            return ({
                "DashboardContent.useEffect": ()=>cancelAnimationFrame(animRef.current)
            })["DashboardContent.useEffect"];
        }
    }["DashboardContent.useEffect"], [
        armada
    ]);
    const filteredPositions = positions.filter((s)=>filter === 'semua' || s.status === filter);
    // Stats
    const total = armada.length;
    const berlayar = armada.filter((s)=>s.status?.toLowerCase().includes('perjalanan')).length;
    const pelabuhan = armada.filter((s)=>s.status?.toLowerCase().includes('pelabuhan')).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '100%',
                    height: '500px',
                    background: '#130a24',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '24px',
                            left: '24px',
                            zIndex: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px'
                                },
                                children: "Peta Pemantauan Global"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#A855F7',
                                    fontSize: '12px',
                                    textTransform: 'uppercase'
                                },
                                children: filter === 'semua' ? 'SELURUH ARMADA' : filter === 'berlayar' ? 'SEDANG BERLAYAR' : 'DI PELABUHAN'
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#22C55E',
                                    boxShadow: '0 0 8px #22C55E',
                                    animation: 'pulse 2s infinite'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '11px',
                                    color: '#22C55E',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px'
                                },
                                children: "LIVE"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "100%",
                        height: "100%",
                        viewBox: "0 0 900 460",
                        preserveAspectRatio: "none",
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                                    id: "grid",
                                    width: "60",
                                    height: "60",
                                    patternUnits: "userSpaceOnUse",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 60 0 L 0 0 0 60",
                                        fill: "none",
                                        stroke: "rgba(168, 85, 247, 0.05)",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                width: "100%",
                                height: "100%",
                                fill: "url(#grid)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50%",
                                cy: "50%",
                                r: "200",
                                fill: "none",
                                stroke: "rgba(168, 85, 247, 0.08)",
                                strokeWidth: "1",
                                strokeDasharray: "4 4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50%",
                                cy: "50%",
                                r: "350",
                                fill: "none",
                                stroke: "rgba(168, 85, 247, 0.04)",
                                strokeWidth: "1"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                opacity: "0.75",
                                style: {
                                    pointerEvents: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                            id: "cyber-glow-radar",
                                            x: "-20%",
                                            y: "-20%",
                                            width: "140%",
                                            height: "140%",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                                    stdDeviation: "3",
                                                    result: "blur"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                            in: "blur"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                            in: "SourceGraphic"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 45 69 L 180 101.2 L 225 165.6 L 153 184 L 81 138 L 45 78.2 Z",
                                        fill: "rgba(168, 85, 247, 0.03)",
                                        stroke: "rgba(168, 85, 247, 0.25)",
                                        strokeWidth: "1.5",
                                        filter: "url(#cyber-glow-radar)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "99",
                                        y: "119.6",
                                        fill: "rgba(168, 85, 247, 0.3)",
                                        fontSize: "8px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        children: "SUMATERA"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 207 326.6 L 369 335.8 L 495 345 L 477 363.4 L 333 354.2 L 207 340.4 Z",
                                        fill: "rgba(168, 85, 247, 0.03)",
                                        stroke: "rgba(168, 85, 247, 0.25)",
                                        strokeWidth: "1.5",
                                        filter: "url(#cyber-glow-radar)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "315",
                                        y: "377.2",
                                        fill: "rgba(168, 85, 247, 0.3)",
                                        fontSize: "8px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        children: "JAWA"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 315 138 L 405 105.8 L 477 119.6 L 495 184 L 423 220.8 L 333 202.4 L 306 165.6 Z",
                                        fill: "rgba(168, 85, 247, 0.03)",
                                        stroke: "rgba(168, 85, 247, 0.25)",
                                        strokeWidth: "1.5",
                                        filter: "url(#cyber-glow-radar)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "360",
                                        y: "165.6",
                                        fill: "rgba(168, 85, 247, 0.3)",
                                        fontSize: "8px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        children: "KALIMANTAN"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 549 165.6 L 657 165.6 L 657 184 L 603 197.8 L 666 230 L 639 248.4 L 585 230 L 567 257.6 L 540 257.6 L 558 211.6 L 522 193.2 Z",
                                        fill: "rgba(168, 85, 247, 0.03)",
                                        stroke: "rgba(168, 85, 247, 0.25)",
                                        strokeWidth: "1.5",
                                        filter: "url(#cyber-glow-radar)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "567",
                                        y: "211.6",
                                        fill: "rgba(168, 85, 247, 0.3)",
                                        fontSize: "8px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        children: "SULAWESI"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M 747 211.6 L 819 202.4 L 873 230 L 873 276 L 819 285.2 L 783 248.4 L 720 239.2 Z",
                                        fill: "rgba(168, 85, 247, 0.03)",
                                        stroke: "rgba(168, 85, 247, 0.25)",
                                        strokeWidth: "1.5",
                                        filter: "url(#cyber-glow-radar)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "774",
                                        y: "248.4",
                                        fill: "rgba(168, 85, 247, 0.3)",
                                        fontSize: "8px",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        children: "PAPUA"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 203,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        {
                                            name: 'Belawan',
                                            x: 135,
                                            y: 92
                                        },
                                        {
                                            name: 'Batam',
                                            x: 225,
                                            y: 161
                                        },
                                        {
                                            name: 'Merak',
                                            x: 234,
                                            y: 335.8
                                        },
                                        {
                                            name: 'Tj. Priok',
                                            x: 270,
                                            y: 331.2
                                        },
                                        {
                                            name: 'Tj. Emas',
                                            x: 342,
                                            y: 340.4
                                        },
                                        {
                                            name: 'Tj. Perak',
                                            x: 405,
                                            y: 345
                                        },
                                        {
                                            name: 'Makassar',
                                            x: 585,
                                            y: 253
                                        },
                                        {
                                            name: 'Sorong',
                                            x: 738,
                                            y: 220.8
                                        }
                                    ].map((port)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: port.x,
                                                    cy: port.y,
                                                    r: "3",
                                                    fill: "#A855F7",
                                                    opacity: "0.8"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: port.x,
                                                    cy: port.y,
                                                    r: "6",
                                                    fill: "none",
                                                    stroke: "#A855F7",
                                                    strokeWidth: "0.5",
                                                    opacity: "0.4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                    x: port.x + 10,
                                                    y: port.y + 4,
                                                    fill: "rgba(139, 123, 168, 0.5)",
                                                    fontSize: "7px",
                                                    style: {
                                                        pointerEvents: 'none'
                                                    },
                                                    children: port.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, port.name, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            filteredPositions.map((ship)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    transform: `translate(${ship.x}, ${ship.y})`,
                                    children: [
                                        ship.status === 'berlayar' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "0",
                                            cy: "0",
                                            r: "20",
                                            fill: "none",
                                            stroke: "#22C55E",
                                            strokeWidth: "1",
                                            opacity: "0.15"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "0",
                                            cy: "0",
                                            r: "6",
                                            fill: ship.status === 'berlayar' ? '#22C55E' : '#3B82F6',
                                            style: {
                                                filter: 'drop-shadow(0px 0px 4px ' + (ship.status === 'berlayar' ? '#22C55E' : '#3B82F6') + ')'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 234,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "0",
                                            cy: "0",
                                            r: "6",
                                            fill: "none",
                                            stroke: ship.status === 'berlayar' ? '#22C55E' : '#3B82F6',
                                            strokeWidth: "2",
                                            opacity: "0.6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                                    attributeName: "r",
                                                    values: "6; 20; 6",
                                                    dur: ship.status === 'berlayar' ? '2s' : '4s',
                                                    repeatCount: "indefinite"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                                    attributeName: "opacity",
                                                    values: "0.6; 0; 0.6",
                                                    dur: ship.status === 'berlayar' ? '2s' : '4s',
                                                    repeatCount: "indefinite"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: "12",
                                            y: "-8",
                                            fill: "rgba(255,255,255,0.85)",
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            style: {
                                                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                            },
                                            children: ship.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: "12",
                                            y: "4",
                                            fill: ship.status === 'berlayar' ? '#22C55E' : '#3B82F6',
                                            fontSize: "8px",
                                            style: {
                                                fontWeight: 'bold'
                                            },
                                            children: ship.status === 'berlayar' ? '▶ berlayar' : '⚓ sandar'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, ship.id, true, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                        children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                },
                children: [
                    {
                        label: 'Total Kapal',
                        value: total,
                        color: '#fff'
                    },
                    {
                        label: 'Sedang Berlayar',
                        value: berlayar,
                        color: '#22C55E'
                    },
                    {
                        label: 'Di Pelabuhan',
                        value: pelabuhan,
                        color: '#3B82F6'
                    }
                ].map(({ label, value, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#130a24',
                            border: '1px solid rgba(168, 85, 247, 0.15)',
                            borderRadius: '12px',
                            padding: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '12px',
                                    color: '#8B7BA8'
                                },
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color
                                },
                                children: value
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: '1 1 400px',
                            background: '#130a24',
                            border: '1px solid rgba(168, 85, 247, 0.15)',
                            borderRadius: '16px',
                            padding: '32px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '18px',
                                    color: 'white',
                                    marginBottom: '16px'
                                },
                                children: "Ringkasan Pemantauan Radar"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: '#8B7BA8',
                                    fontSize: '14px',
                                    lineHeight: '1.8'
                                },
                                children: [
                                    "Sistem KOMANDO SIWeb mendeteksi pergerakan arus logistik maritim secara stabil. Distribusi armada difokuskan pada pengiriman menuju pelabuhan-pelabuhan strategis utama.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#C084FC'
                                        },
                                        children: [
                                            " Cuaca saat ini: ",
                                            cuaca,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: '1 1 250px',
                            background: 'rgba(20, 10, 36, 0.8)',
                            border: '1px solid rgba(168, 85, 247, 0.1)',
                            borderRadius: '16px',
                            padding: '32px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center'
                            },
                            children: role === 'Admin' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            color: 'white',
                                            marginBottom: '8px'
                                        },
                                        children: "KENDALI NAVIGASI PUSAT"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: '#8B7BA8',
                                            fontSize: '12px',
                                            marginBottom: '16px'
                                        },
                                        children: "Khusus Admin: Update status cuaca global."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 297,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '8px',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap'
                                        },
                                        children: [
                                            'Badai Ekstrem',
                                            'Terik Gersang',
                                            'Normal'
                                        ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>updateCuaca(c),
                                                style: {
                                                    background: cuaca === c ? c === 'Badai Ekstrem' ? '#EF4444' : c === 'Terik Gersang' ? '#F59E0B' : '#22C55E' : c === 'Badai Ekstrem' ? 'rgba(239,68,68,0.2)' : c === 'Terik Gersang' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
                                                    border: `1px solid ${c === 'Badai Ekstrem' ? '#EF4444' : c === 'Terik Gersang' ? '#F59E0B' : '#22C55E'}`,
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    cursor: 'pointer'
                                                },
                                                children: c
                                            }, c, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 300,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            color: 'white',
                                            marginBottom: '8px'
                                        },
                                        children: "STATUS LINGKUNGAN"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: '#8B7BA8'
                                        },
                                        children: [
                                            "Status Saat Ini: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: '#C084FC'
                                                },
                                                children: [
                                                    "[",
                                                    cuaca,
                                                    "]"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 66
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_s(DashboardContent, "X/IrriF32yFMQFVOSFibtDwRhCU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboard"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = DashboardContent;
function RingkasanDashboard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: 'white'
            },
            children: "Memuat data radar..."
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 326,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardContent, {}, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 327,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
_c1 = RingkasanDashboard;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardContent");
__turbopack_context__.k.register(_c1, "RingkasanDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_dashboard_page_tsx_0mlxak_._.js.map