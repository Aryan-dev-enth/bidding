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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="text-white animate-pulse text-xl">Loading players...</div>
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
     <div className="absolute inset-0 -z-10">
  {/* Background image from public folder */}
  <div
    className="w-full h-full bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url("/bg.jpg")`, // make sure bg.png is in public folder
    }}
  />
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/50 to-emerald-900/60"></div>
</div>


      {/* Stadium lights effect */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

      <div
        className={`relative max-w-7xl w-full bg-black/50 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 ${
          isTransitioning ? "scale-95 opacity-60" : "scale-100 opacity-100"
        }`}
      >
        {/* Player Name Header with Navigation */}
        <div className="text-center py-6 bg-gradient-to-r from-yellow-400/30 via-yellow-300/30 to-yellow-400/30 border-b border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-5xl mx-auto px-6">
            <button
              onClick={prev}
              className="group flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft size={20} className="text-white group-hover:text-yellow-400" />
              <span className="text-sm font-medium text-white group-hover:text-yellow-400">Previous</span>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-sm font-medium text-yellow-200 tracking-wider">
                  PLAYER {index + 1} OF {players.length}
                </div>
                
                {/* Jump to Player Button */}
                <button
                  onClick={() => setShowJumpInput(!showJumpInput)}
                  className="group bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/30 transition-all duration-300"
                  title="Jump to player"
                >
                  <Search size={16} className="text-white group-hover:text-yellow-400" />
                </button>
              </div>

              {/* Jump to Player Input */}
              {showJumpInput && (
                <div className="flex items-center gap-2 mb-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <input
                    type="number"
                    value={jumpToPlayer}
                    onChange={(e) => setJumpToPlayer(e.target.value)}
                    placeholder={`1-${players.length}`}
                    className="w-20 bg-transparent text-white text-center text-sm placeholder-gray-400 outline-none"
                    min="1"
                    max={players.length}
                    onKeyPress={(e) => e.key === 'Enter' && jumpToPlayerNumber()}
                  />
                  <button
                    onClick={jumpToPlayerNumber}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                  >
                    Go
                  </button>
                </div>
              )}
              
              <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                {player.name}
              </h1>
            </div>
            
            <button
              onClick={next}
              className="group flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            >
              <span className="text-sm font-medium text-white group-hover:text-yellow-400">Next</span>
              <ChevronRight size={20} className="text-white group-hover:text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {nationLogo ? (
                <Image
                  src={nationLogo}
                  alt={`${player.name} nation`}
                  width={44}
                  height={32}
                  quality={100}
                  className="rounded shadow-lg border border-white/20"
                />
              ) : (
                <div className="w-11 h-8 bg-gray-600 rounded flex items-center justify-center border border-white/20">
                  <span className="text-xs text-gray-300">🏳️</span>
                </div>
              )}
              
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

          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-yellow-400/40 shadow-xl">
            <div className="text-sm font-medium text-yellow-200 uppercase tracking-wider text-center">Overall Rating</div>
            <div className="text-4xl font-black text-yellow-400 text-center">{player.ovr}</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row items-start gap-8 px-8 pb-8">
          {/* left: image & basic */}
          <div className="flex flex-col items-center w-full lg:w-1/3">
            <div className="relative w-64 h-64 rounded-2xl bg-gradient-to-br from-green-500/30 via-emerald-500/30 to-green-600/30 border-2 border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
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

            <div className="mt-6 bg-gradient-to-r from-green-600/40 to-emerald-600/40 backdrop-blur-sm px-8 py-5 rounded-2xl text-center border-2 border-green-400/40 shadow-xl">
              <div className="text-sm font-bold text-green-200 uppercase tracking-wider">Base Price (INR)</div>
              <div className="text-white font-black text-3xl mt-1">₹{player.basePrice || "N/A"} Cr</div>
            </div>

            {/* Player Details */}
            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Age</div>
                <div className="text-xl font-bold text-white">{player.age || "N/A"}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Height</div>
                <div className="text-xl font-bold text-white">{player.height || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* right: stats */}
          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              <StatCircle label="PACE" value={stats.pac} Icon={Zap} idx={0} />
              <StatCircle label="SHOOT" value={stats.sho} Icon={Target} idx={1} />
              <StatCircle label="PASS" value={stats.pas} Icon={TrendingUp} idx={2} />
              <StatCircle label="DRIBBLE" value={stats.dri} Icon={Star} idx={3} />
              <StatCircle label="DEFEND" value={stats.def} Icon={Shield} idx={4} />
              <StatCircle label="PHYSICAL" value={stats.phy} Icon={Trophy} idx={5} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Market Value</div>
                <div className="text-white font-bold text-lg mt-1">{player.value || "N/A"}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Weekly Wage</div>
                <div className="text-white font-bold text-lg mt-1">{player.wage || "N/A"}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Weak Foot</div>
                <div className="text-white font-bold text-lg mt-1">{player.weak_foot || "N/A"}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/30 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">Skill Moves</div>
                <div className="text-white font-bold text-lg mt-1">{player.skill_moves || "N/A"}</div>
              </div>
            </div>

            <div className="flex gap-6 justify-center">
              <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm px-8 py-5 rounded-xl text-center border border-blue-400/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-300">
                <div className="text-sm font-medium text-blue-300 uppercase tracking-wide">Attack Work Rate</div>
                <div className="text-white font-bold text-lg mt-1">{player.attacking_workrate || "N/A"}</div>
              </div>
              <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-sm px-8 py-5 rounded-xl text-center border border-red-400/40 hover:from-red-500/40 hover:to-pink-500/40 transition-all duration-300">
                <div className="text-sm font-medium text-red-300 uppercase tracking-wide">Defense Work Rate</div>
                <div className="text-white font-bold text-lg mt-1">{player.defensive_workrate || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Side navigation buttons - now more subtle */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={prev}
            className="group bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
            disabled={players.length <= 1}
          >
            <ChevronLeft size={24} className="text-white group-hover:text-yellow-400" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={next}
            className="group bg-black/40 hover:bg-black/60 backdrop-blur-sm p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 opacity-60 hover:opacity-100"
            disabled={players.length <= 1}
          >
            <ChevronRight size={24} className="text-white group-hover:text-yellow-400" />
          </button>
        </div>

        {/* Enhanced Progress Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30 shadow-xl">
            <div className="flex items-center gap-6">
              <button
                onClick={prev}
                className="group p-2 rounded-full hover:bg-white/15 transition-all duration-200"
                disabled={players.length <= 1}
              >
                <ChevronLeft size={18} className="text-white group-hover:text-yellow-400" />
              </button>
              
              <div className="flex gap-2 max-w-md overflow-hidden">
                {players.slice(Math.max(0, index - 5), Math.min(players.length, index + 6)).map((_, i) => {
                  const actualIndex = Math.max(0, index - 5) + i;
                  return (
                    <button
                      key={actualIndex}
                      className={`h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        actualIndex === index 
                          ? "bg-yellow-400 w-10 shadow-lg" 
                          : "bg-white/40 w-3 hover:bg-white/60"
                      }`}
                      onClick={() => setIndex(actualIndex)}
                    />
                  );
                })}
              </div>
              
              <button
                onClick={next}
                className="group p-2 rounded-full hover:bg-white/15 transition-all duration-200"
                disabled={players.length <= 1}
              >
                <ChevronRight size={18} className="text-white group-hover:text-yellow-400" />
              </button>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-sm font-bold text-white tracking-wider">
                {index + 1} / {players.length}
              </span>
            </div>
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