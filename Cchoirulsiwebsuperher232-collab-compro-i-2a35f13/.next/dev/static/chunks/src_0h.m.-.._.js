(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/context/DashboardContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardProvider",
    ()=>DashboardProvider,
    "useDashboard",
    ()=>useDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DashboardContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useDashboard = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DashboardContext);
};
_s(useDashboard, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const DashboardProvider = ({ children })=>{
    _s1();
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('User');
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [armada, setArmada] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cuaca, setCuaca] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Standar');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const FALLBACK_ARMADA = [
        {
            id: 1,
            name: 'KM NUSANTARA',
            type: 'Kapal Petikemas',
            status: 'DALAM PERJALANAN',
            statusColor: '#22C55E',
            location: 'Laut Jawa',
            destination: 'Tanjung Perak',
            eta: '2026-04-12 08:30',
            cargo: 'Elektronik',
            update: 'Baru saja'
        },
        {
            id: 2,
            name: 'KM BIMA SAKTI',
            type: 'Kapal Kargo Bulk',
            status: 'DI PELABUHAN',
            statusColor: '#3B82F6',
            location: 'Pelabuhan Tanjung Priok',
            destination: 'Tanjung Priok',
            eta: 'Tiba',
            cargo: 'Batu Bara',
            update: '5 mnt lalu'
        },
        {
            id: 3,
            name: 'KM SRIWIJAYA',
            type: 'Kapal Tanker',
            status: 'TERLAMBAT',
            statusColor: '#F59E0B',
            location: 'Selat Sunda',
            destination: 'Pelabuhan Merak',
            eta: '2026-04-11 14:00',
            cargo: 'Minyak Mentah',
            update: '1 mnt lalu'
        },
        {
            id: 4,
            name: 'KM GADJAH MADA',
            type: 'Kapal Petikemas',
            status: 'PEMELIHARAAN',
            statusColor: '#EF4444',
            location: 'Galangan Kapal Batam',
            destination: 'Batam',
            eta: 'Dalam Perawatan',
            cargo: '-',
            update: '10 mnt lalu'
        },
        {
            id: 5,
            name: 'KM KARTINI',
            type: 'Kapal Kargo',
            status: 'DALAM PERJALANAN',
            statusColor: '#22C55E',
            location: 'Laut Sulawesi',
            destination: 'Makassar',
            eta: '2026-04-10 16:45',
            cargo: 'Suku Cadang Mesin',
            update: 'Baru saja'
        },
        {
            id: 6,
            name: 'KM MAJAPAHIT',
            type: 'Kapal Kargo Bulk',
            status: 'DALAM PERJALANAN',
            statusColor: '#22C55E',
            location: 'Selat Malaka',
            destination: 'Belawan',
            eta: '2026-04-09 22:15',
            cargo: 'Beras',
            update: 'Baru saja'
        },
        {
            id: 7,
            name: 'KM DEWARUCI',
            type: 'Kapal Tanker',
            status: 'DI PELABUHAN',
            statusColor: '#3B82F6',
            location: 'Pelabuhan Tanjung Emas',
            destination: 'Semarang',
            eta: 'Tiba',
            cargo: 'LNG',
            update: '7 mnt lalu'
        },
        {
            id: 8,
            name: 'KM CENDRAWASIH',
            type: 'Kapal Petikemas',
            status: 'DALAM PERJALANAN',
            statusColor: '#22C55E',
            location: 'Laut Banda',
            destination: 'Sorong',
            eta: '2026-04-13 10:00',
            cargo: 'Barang Konsumsi',
            update: 'Baru saja'
        }
    ];
    // ─── Fetch ────────────────────────────────────────────────
    const fetchArmada = async ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const savedUser = localStorage.getItem('username') || 'Tamu';
            const savedRole = localStorage.getItem('role') || 'User';
            setUsername(savedUser);
            setRole(savedRole);
            const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`);
            if (!res.ok) {
                const errBody = await res.json().catch(()=>({}));
                console.error(`[fetchArmada] HTTP ${res.status}:`, errBody);
                setArmada(FALLBACK_ARMADA);
                return;
            }
            const data = await res.json();
            setArmada(data.armada?.length ? data.armada : FALLBACK_ARMADA);
            if (data.role) setRole(data.role);
        } catch (error) {
            console.error('[fetchArmada] Network/parse error:', error);
            setArmada(FALLBACK_ARMADA);
        } finally{
            setLoading(false);
        }
    };
    // ─── Tambah Kapal ─────────────────────────────────────────
    const tambahKapal = async (dataKapal)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const savedUser = localStorage.getItem('username') || '';
            const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataKapal)
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                console.error('[tambahKapal] Gagal:', err);
                return {
                    success: false,
                    error: err
                };
            }
            const data = await res.json();
            // Update state lokal langsung — tidak perlu refetch semua
            setArmada((prev)=>[
                    ...prev,
                    data.kapal
                ]);
            return {
                success: true,
                kapal: data.kapal
            };
        } catch (error) {
            console.error('[tambahKapal] Error:', error);
            return {
                success: false,
                error
            };
        }
    };
    // ─── Hapus Kapal ──────────────────────────────────────────
    const hapusKapal = async (id)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const savedUser = localStorage.getItem('username') || '';
            const res = await fetch(`/api/kapal?id=${id}&username=${encodeURIComponent(savedUser)}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                console.error('[hapusKapal] Gagal:', err);
                return {
                    success: false,
                    error: err
                };
            }
            // Hapus dari state lokal langsung
            setArmada((prev)=>prev.filter((k)=>k.id !== id));
            return {
                success: true
            };
        } catch (error) {
            console.error('[hapusKapal] Error:', error);
            return {
                success: false,
                error
            };
        }
    };
    // ─── Cuaca ────────────────────────────────────────────────
    const updateCuaca = (status)=>{
        setCuaca(status);
        console.log(`Mengirim POST Request -> Cuaca update: ${status}`);
    };
    // ─── Polling ──────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardProvider.useEffect": ()=>{
            fetchArmada();
            const intervalId = setInterval(fetchArmada, 60000);
            return ({
                "DashboardProvider.useEffect": ()=>clearInterval(intervalId)
            })["DashboardProvider.useEffect"];
        }
    }["DashboardProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardContext.Provider, {
        value: {
            role,
            username,
            armada,
            cuaca,
            loading,
            updateCuaca,
            tambahKapal,
            hapusKapal,
            refreshData: fetchArmada
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/DashboardContext.tsx",
        lineNumber: 133,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(DashboardProvider, "z1hTq3FvDxIH1+VPFE0SkJMrcKw=");
_c = DashboardProvider;
var _c;
__turbopack_context__.k.register(_c, "DashboardProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DashboardContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function DashboardLayout({ children }) {
    _s();
    const [dropdownOpen, setDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DashboardContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '100%',
                minHeight: '100vh',
                background: 'var(--bg-page, #0A0414)',
                color: 'white',
                fontFamily: 'var(--font-body, monospace)',
                display: 'flex',
                flexDirection: 'column'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        padding: '16px 24px',
                        borderBottom: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
                        background: 'rgba(10, 4, 20, 0.95)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 50
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '40px',
                                        height: '40px',
                                        background: 'white',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/logo.png",
                                        alt: "Logo",
                                        width: 32,
                                        height: 32,
                                        style: {
                                            objectFit: 'contain'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/layout.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px'
                                            },
                                            children: "KOMANDO SIWeb"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '10px',
                                                color: 'var(--text-muted, #8B7BA8)'
                                            },
                                            children: "Monitoring Armada Dunia v2.0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/layout.tsx",
                            lineNumber: 38,
                            columnNumber: 11
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
                                        position: 'relative'
                                    },
                                    onMouseEnter: ()=>setDropdownOpen(true),
                                    onMouseLeave: ()=>setDropdownOpen(false),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: pathname === '/dashboard' || pathname.startsWith('/dashboard/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
                                                padding: '8px 16px',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px',
                                                boxShadow: pathname === '/dashboard' || pathname.startsWith('/dashboard/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "14",
                                                    height: "14",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "3",
                                                            y: "3",
                                                            width: "7",
                                                            height: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                                            lineNumber: 79,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "14",
                                                            y: "3",
                                                            width: "7",
                                                            height: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                                            lineNumber: 80,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "14",
                                                            y: "14",
                                                            width: "7",
                                                            height: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                                            lineNumber: 81,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                            x: "3",
                                                            y: "14",
                                                            width: "7",
                                                            height: "7"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                                            lineNumber: 82,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 17
                                                }, this),
                                                "DASHBOARD"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this),
                                        dropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '200px',
                                                background: 'rgba(20, 10, 36, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
                                                borderRadius: '4px',
                                                padding: '8px 0',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginTop: '4px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                                zIndex: 100
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>window.location.href = '/dashboard?filter=semua',
                                                    style: {
                                                        padding: '10px 16px',
                                                        color: 'var(--text-light, #C7B8EA)',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        borderLeft: '2px solid transparent'
                                                    },
                                                    children: "Total Armada Aktif"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>window.location.href = '/dashboard?filter=berlayar',
                                                    style: {
                                                        padding: '10px 16px',
                                                        color: 'var(--text-light, #C7B8EA)',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        borderLeft: '2px solid transparent',
                                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                                    },
                                                    children: "Sedang Berlayar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>window.location.href = '/dashboard?filter=sandar',
                                                    style: {
                                                        padding: '10px 16px',
                                                        color: 'var(--text-light, #C7B8EA)',
                                                        textDecoration: 'none',
                                                        fontSize: '12px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        borderLeft: '2px solid transparent',
                                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                                    },
                                                    children: "Tiba di Tujuan"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 89,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/fleet",
                                    style: {
                                        background: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        color: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? 'white' : 'var(--text-muted, #8B7BA8)',
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                        boxShadow: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "4",
                                                    y1: "22",
                                                    x2: "4",
                                                    y2: "15"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this),
                                        "ARMADA"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/map",
                                    style: {
                                        background: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        color: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? 'white' : 'var(--text-muted, #8B7BA8)',
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                        boxShadow: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "9",
                                                    y1: "3",
                                                    x2: "9",
                                                    y2: "18"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "15",
                                                    y1: "6",
                                                    x2: "15",
                                                    y2: "21"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this),
                                        "PETA"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/analytics",
                                    style: {
                                        background: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        color: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? 'white' : 'var(--text-muted, #8B7BA8)',
                                        textDecoration: 'none',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                        boxShadow: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "22 12 18 12 15 21 9 3 6 12 2 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/layout.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        "ANALITIK"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/layout.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(20, 10, 36, 0.8)',
                                        border: '1px solid rgba(168, 85, 247, 0.2)',
                                        padding: '8px 12px',
                                        borderRadius: '4px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#22C55E',
                                                boxShadow: '0 0 8px #22C55E'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                lineHeight: '1.2'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '10px',
                                                        color: 'var(--text-muted, #8B7BA8)'
                                                    },
                                                    children: "SISTEM"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '10px',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    },
                                                    children: "ONLINE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '11px',
                                        color: 'var(--text-muted, #8B7BA8)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        lineHeight: '1.4'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "14 Apr 2026,"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 225,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "16.57"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        color: 'var(--text-muted, #8B7BA8)',
                                        textDecoration: 'none',
                                        fontSize: '11px',
                                        transition: 'background 0.2s',
                                        cursor: 'pointer'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)',
                                    onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "12",
                                            height: "12",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                    points: "16 17 21 12 16 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "21",
                                                    y1: "12",
                                                    x2: "9",
                                                    y2: "12"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/layout.tsx",
                                            lineNumber: 245,
                                            columnNumber: 15
                                        }, this),
                                        "KELUAR"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/layout.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/layout.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/layout.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    style: {
                        flex: 1,
                        padding: '24px',
                        width: '100%',
                        boxSizing: 'border-box',
                        overflowX: 'hidden'
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/layout.tsx",
                    lineNumber: 255,
                    columnNumber: 8
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/layout.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboard/layout.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(DashboardLayout, "aJZXzgnNe/wgHExjFBAZTCmPDFU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = DashboardLayout;
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0h.m.-.._.js.map