"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Papa from "papaparse";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Trophy,
  Target,
  Shield,
  Zap,
  Search,
  User,
} from "lucide-react";
import { getClubLogo } from "./constants/clubLogoMap";

export default function ModernPlayerSlideshow() {
  const [players, setPlayers] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [jumpToPlayer, setJumpToPlayer] = useState("");
  const [showJumpInput, setShowJumpInput] = useState(false);

  // Load players.json and merge with CSV base prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load players.json
        const playersRes = await fetch("/players.json");
        if (!playersRes.ok) throw new Error("Failed to fetch /players.json");
        const playersData = await playersRes.json();
        const playersArray = playersData.players || playersData || [];

        try {
          // Load and parse CSV
          const csvRes = await fetch("/players_info.csv");
          if (csvRes.ok) {
            const csvText = await csvRes.text();
            
            const parsedCSV = Papa.parse(csvText, { 
              header: true, 
              skipEmptyLines: true,
              dynamicTyping: true,
              transformHeader: (header) => header.trim().toLowerCase()
            }).data;

            console.log("CSV parsed:", parsedCSV.slice(0, 3)); // Debug log

            // Merge base prices from CSV into players
            const mergedPlayers = playersArray.map(player => {
              const playerName = player.name?.trim().toLowerCase();
              const csvMatch = parsedCSV.find(row => {
                const csvName = row.name?.toString().trim().toLowerCase();
                return csvName === playerName || csvName?.includes(playerName) || playerName?.includes(csvName);
              });
              
              return {
                ...player,
                basePrice: player.base_price || "N/A"
              };
            });

            setPlayers(mergedPlayers);
          } else {
            console.warn("CSV file not found, using original player data");
            setPlayers(playersArray);
          }
        } catch (csvError) {
          console.warn("Error loading CSV:", csvError);
          setPlayers(playersArray);
        }

        setIndex(0);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  // safety
  if (!players || players.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted animate-pulse text-lg">Loading players...</div>
      </div>
    );
  }

  const player = players[index] || players[0];
  const stats = player.stats || {};

  const next = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex((p) => (p + 1) % players.length);
      setIsTransitioning(false);
    }, 140);
  };

  const prev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex((p) => (p - 1 + players.length) % players.length);
      setIsTransitioning(false);
    }, 140);
  };

  const jumpToPlayerNumber = () => {
    const playerNum = parseInt(jumpToPlayer);
    if (playerNum >= 1 && playerNum <= players.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex(playerNum - 1);
        setIsTransitioning(false);
        setJumpToPlayer("");
        setShowJumpInput(false);
      }, 140);
    }
  };

  // Enhanced club logo with fallback
  const getTeamLogo = (clubName, teamImageUrl) => {
    const clubLogo = getClubLogo(clubName);
    if (clubLogo) return clubLogo;
    if (teamImageUrl) return teamImageUrl;
    return null; // Will show default icon instead
  };

  const teamLogo = getTeamLogo(player.club, player.images?.team);
  const nationLogo = player.images?.nation || null;
  const headshot = player.images?.headshot || null;

  // stat color pairs
  const getStatColors = (val) => {
    const n = parseInt(val || "0", 10);
    if (n >= 90) return ["#34D399", "#059669"]; // green
    if (n >= 80) return ["#60A5FA", "#06B6D4"]; // blue/cyan
    if (n >= 70) return ["#FCD34D", "#F97316"]; // yellow/orange
    if (n >= 60) return ["#FB923C", "#F43F5E"]; // orange/red
    return ["#F87171", "#EF4444"]; // red-ish
  };

  const StatCircle = ({ label, value, Icon, idx }) => {
    const v = parseInt(value || "0", 10);
    const percentage = Math.max(0, Math.min(100, (v / 99) * 100));
    const r = 38;
    const circumference = 2 * Math.PI * r;
    const dash = `${(percentage / 100) * circumference} ${circumference}`;
    const [from, to] = getStatColors(v);
    const id = `grad-${label}-${idx}`;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
            <defs>
              <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={from} />
                <stop offset="100%" stopColor={to} />
              </linearGradient>
            </defs>

            <circle
              cx="50"
              cy="50"
              r={r}
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              stroke={`url(#${id})`}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={dash}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className="w-4 h-4 mb-1 text-white" />
            <div className="text-white font-semibold text-sm">{value || "0"}</div>
          </div>
        </div>
        <div className="text-xs text-gray-300 mt-2 font-medium uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className={`relative max-w-6xl w-full card overflow-hidden transition-transform duration-200 ${
          isTransitioning ? "scale-98 opacity-90" : "scale-100 opacity-100"
        }`}
      >
        {/* Player Name Header with Navigation */}
        <div className="px-8 py-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={prev} className="btn-primary" title="Previous">
                <ChevronLeft size={16} />
              </button>
              <div className="text-sm text-muted">PLAYER {index + 1} / {players.length}</div>
            </div>

            <h1 className="text-2xl font-semibold">{player.name}</h1>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowJumpInput(!showJumpInput)} className="text-muted">
                <Search size={18} />
              </button>
              <button onClick={next} className="btn-primary" title="Next">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {showJumpInput && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                value={jumpToPlayer}
                onChange={(e) => setJumpToPlayer(e.target.value)}
                placeholder={`1-${players.length}`}
                className="w-24 px-3 py-2 border rounded-md"
                min="1"
                max={players.length}
                onKeyPress={(e) => e.key === 'Enter' && jumpToPlayerNumber()}
              />
              <button onClick={jumpToPlayerNumber} className="btn-primary">Go</button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {nationLogo ? (
                <Image src={nationLogo} alt={`${player.name} nation`} width={40} height={24} className="rounded" />
              ) : null}
              {teamLogo ? (
                <Image
                  src={teamLogo}
                  alt={player.club}
                  width={44}
                  height={44}
                  quality={100}
                  className="rounded border border-white/20"
                />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center border border-white/20">
                  <Trophy size={24} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="text-gray-200">
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Club</div>
              <div className="text-xl font-bold text-white">{player.club}</div>
            </div>
          </div>

          <div className="px-6 py-3 text-center card">
            <div className="text-sm text-muted uppercase tracking-wide">Overall</div>
            <div className="text-2xl font-bold">{player.ovr}</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row items-start gap-8 px-8 pb-8">
          {/* left: image & basic */}
          <div className="flex flex-col items-center w-full lg:w-1/3">
            <div className="relative w-64 h-64 rounded-xl card flex items-center justify-center">
              {headshot ? (
                <Image
                  src={headshot}
                  alt={player.name}
                  width={220}
                  height={220}
                  quality={100}
                  priority
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="w-52 h-52 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <User size={80} className="text-gray-300" />
                </div>
              )}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 px-4 rounded-xl text-sm font-black shadow-lg">
                POT {player.pot}
              </div>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap justify-center">
              {(player.positions || []).map((p, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg border border-green-400/50"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-6 px-6 py-4 card text-center">
              <div className="text-sm text-muted uppercase tracking-wide">Base Price</div>
              <div className="text-lg font-bold mt-1">₹{player.basePrice || "N/A"} Cr</div>
            </div>

            {/* Player Details */}
            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 card text-center">
                <div className="text-xs text-muted uppercase tracking-wide">Age</div>
                <div className="text-lg font-semibold">{player.age || "N/A"}</div>
              </div>
              <div className="p-4 card text-center">
                <div className="text-xs text-muted uppercase tracking-wide">Height</div>
                <div className="text-lg font-semibold">{player.height || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* right: stats */}
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* Simplified small stat badges */}
              {
                [["PACE", stats.pac],["SHOOT", stats.sho],["PASS", stats.pas],["DRIBBLE", stats.dri],["DEFEND", stats.def],["PHYSICAL", stats.phy]].map(([label, val], i) => (
                <div key={i} className="p-3 card text-center">
                  <div className="text-xs text-muted uppercase">{label}</div>
                  <div className="text-lg font-semibold">{val || 0}</div>
                </div>
              ))
              }
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[ ["Market Value", player.value], ["Weekly Wage", player.wage], ["Weak Foot", player.weak_foot], ["Skill Moves", player.skill_moves] ].map(([label, val], i) => (
                <div key={i} className="p-4 card text-center">
                  <div className="text-xs text-muted uppercase">{label}</div>
                  <div className="mt-1 font-medium">{val || "N/A"}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <div className="p-4 card text-center">
                <div className="text-xs text-muted uppercase">Attack Work Rate</div>
                <div className="font-medium">{player.attacking_workrate || "N/A"}</div>
              </div>
              <div className="p-4 card text-center">
                <div className="text-xs text-muted uppercase">Defense Work Rate</div>
                <div className="font-medium">{player.defensive_workrate || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple side nav buttons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button onClick={prev} className="p-2 card" disabled={players.length <= 1}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button onClick={next} className="p-2 card" disabled={players.length <= 1}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Simple pagination dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {players.slice(Math.max(0, index - 5), Math.min(players.length, index + 6)).map((_, i) => {
              const actualIndex = Math.max(0, index - 5) + i;
              return (
                <button
                  key={actualIndex}
                  className={`h-2 rounded-full transition-all duration-200 ${actualIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                  onClick={() => setIndex(actualIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}