import { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Gamepad2, 
  Sparkles, 
  HelpCircle, 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  FileText, 
  RotateCcw, 
  ExternalLink,
  Compass,
  Trophy,
  Zap,
  Flame,
  X
} from 'lucide-react';

export default function NotFound() {
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'game'

  // Interactive Quote Generator
  const [quoteIndex, setQuoteIndex] = useState(0);
  const cosmicQuotes = [
    "“Not all those who wander are lost... but this page definitely is.”",
    "“ Houston, we have a 404 error. ”",
    "“ In an infinite universe, this page exists in an alternate dimension. ”",
    "“ You've reached the dark side of the web. Time to head back to light! ”",
    "“ Even light cannot escape black holes, nor can data from this dead link. ”"
  ];

  // Game States
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gamePlaying, setGamePlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Quick Links Configuration
  const popularLinks = [
    { title: 'Dashboard', desc: 'Return to your main workspace summary', icon: LayoutDashboard, href: '#dashboard', tag: 'Popular' },
    { title: 'Pricing & Plans', desc: 'Explore scalable features and pricing', icon: CreditCard, href: '#pricing' },
    { title: 'Help & Support', desc: 'Browse knowledge base or chat with support', icon: HelpCircle, href: '#help', tag: '24/7 Support' },
    { title: 'Documentation', desc: 'API references and integration guides', icon: BookOpen, href: '#docs' },
    { title: 'Latest Blog', desc: 'Read news, guides, and engineering updates', icon: FileText, href: '#blog' },
  ];

  // Handle Live Search Filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const filtered = popularLinks.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Next Random Quote
  const getNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % cosmicQuotes.length);
  };

  // Mini-Game Engine (Canvas Asteroid Blaster)
  useEffect(() => {
    if (activeTab !== 'game') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas Size Setup
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;

    // Game Variables
    let ship = {
      x: canvas.width / 2,
      y: canvas.height - 40,
      size: 20,
      speed: 7,
      dx: 0
    };

    let bullets = [];
    let asteroids = [];
    let particles = [];
    let frameCount = 0;
    let localScore = 0;
    let isRunning = true;

    // Keys State
    const keys = { Left: false, Right: false, Space: false };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.Left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.Right = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!keys.Space && isRunning) {
          bullets.push({ x: ship.x, y: ship.y - 15, radius: 3, speed: 8 });
        }
        keys.Space = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.Left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.Right = false;
      if (e.key === ' ' || e.key === 'Spacebar') keys.Space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Spawn Asteroids
    const spawnAsteroid = () => {
      const radius = Math.random() * 15 + 15;
      asteroids.push({
        x: Math.random() * (canvas.width - radius * 2) + radius,
        y: -radius,
        radius: radius,
        speed: Math.random() * 2 + 1.5 + (localScore * 0.05),
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
    };

    // Explosion Effect
    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x, y,
          dx: (Math.random() - 0.5) * 6,
          dy: (Math.random() - 0.5) * 6,
          radius: Math.random() * 3 + 1,
          color: color || '#A855F7',
          life: 25
        });
      }
    };

    // Game Loop
    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Starry Background inside Game Canvas
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move Ship
      if (keys.Left && ship.x - ship.size > 0) ship.x -= ship.speed;
      if (keys.Right && ship.x + ship.size < canvas.width) ship.x += ship.speed;

      // Draw Ship (Stylized Rocket)
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(0, -ship.size);
      ctx.lineTo(-ship.size, ship.size);
      ctx.lineTo(ship.size, ship.size);
      ctx.closePath();
      ctx.fill();

      // Thruster Flame Effect
      ctx.fillStyle = Math.random() > 0.5 ? '#F97316' : '#EF4444';
      ctx.beginPath();
      ctx.moveTo(-ship.size / 2, ship.size);
      ctx.lineTo(0, ship.size + 12 + Math.random() * 6);
      ctx.lineTo(ship.size / 2, ship.size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Bullets Update & Draw
      bullets.forEach((b, index) => {
        b.y -= b.speed;
        ctx.fillStyle = '#C084FC';
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Remove Off-screen Bullets
        if (b.y < 0) bullets.splice(index, 1);
      });

      // Spawn Asteroids
      frameCount++;
      if (frameCount % Math.max(20, 60 - Math.floor(localScore / 2)) === 0) {
        spawnAsteroid();
      }

      // Asteroids Update & Collision
      asteroids.forEach((ast, aIndex) => {
        ast.y += ast.speed;
        ast.angle += ast.rotationSpeed;

        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.angle);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#1E293B';

        ctx.beginPath();
        ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Check Collision with Ship
        const distShip = Math.hypot(ship.x - ast.x, ship.y - ast.y);
        if (distShip < ship.size + ast.radius - 5) {
          createExplosion(ship.x, ship.y, '#EF4444');
          isRunning = false;
          setGameOver(true);
          setGamePlaying(false);
        }

        // Check Collision with Bullets
        bullets.forEach((b, bIndex) => {
          const distBullet = Math.hypot(b.x - ast.x, b.y - ast.y);
          if (distBullet < b.radius + ast.radius) {
            createExplosion(ast.x, ast.y, '#38BDF8');
            asteroids.splice(aIndex, 1);
            bullets.splice(bIndex, 1);
            localScore += 10;
            setScore(localScore);
            setHighScore((prev) => Math.max(prev, localScore));
          }
        });

        // Remove Off-screen Asteroids
        if (ast.y - ast.radius > canvas.height) {
          asteroids.splice(aIndex, 1);
        }
      });

      // Update Particles
      particles.forEach((p, pIndex) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(pIndex, 1);
      });

      if (isRunning) {
        gameLoopRef.current = requestAnimationFrame(render);
      }
    };

    if (gamePlaying) {
      render();
    } else {
      // Draw Static Welcome on Canvas
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      isRunning = false;
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab, gamePlaying]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGamePlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Dynamic Starfield Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>
        {/* Animated Floating Ambient Particles */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Stars overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 flex flex-col justify-center">
        
        {/* Navigation Bar / Branding */}
        <header className="flex items-center justify-between py-4 mb-8 border-b border-slate-800/60">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('main')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <span className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              COSMIC<span className="text-purple-400">NAV</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab(activeTab === 'main' ? 'game' : 'main')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${
                activeTab === 'game' 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/30' 
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>{activeTab === 'game' ? 'Exit Game' : 'Mini Game'}</span>
            </button>
          </div>
        </header>

        {activeTab === 'main' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Area: Hero Message & Search */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
                <span>Error 404 • Lost in Space</span>
              </div>

              {/* Huge Header */}
              <div className="space-y-3">
                <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-400">
                  404
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-200">
                  Houston, this page does not exist.
                </h2>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                  The link you followed might be broken, or the destination page has been moved into a black hole. Let's get you safely back to orbit!
                </p>
              </div>

              {/* Interactive Quote / Space Thought */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Deep Space Reflection</span>
                  <p className="text-sm italic text-slate-300">{cosmicQuotes[quoteIndex]}</p>
                </div>
                <button 
                  onClick={getNextQuote}
                  title="Next Quote"
                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 rounded-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Home className="w-5 h-5" />
                  <span>Return to Home</span>
                </a>

                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 hover:border-slate-700 flex items-center space-x-2 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Go Back</span>
                </button>
              </div>

              {/* Interactive Search Engine */}
              <div className="relative max-w-xl">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Looking for something specific?
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search docs, features, dashboard..."
                    className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant Search Suggestions Dropdown */}
                {isSearching && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-800">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.href}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-800/60 transition"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm font-medium text-slate-200">{item.title}</div>
                              <div className="text-xs text-slate-400">{item.desc}</div>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-500" />
                        </a>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-400">
                        No pages found matching "<span className="text-slate-200">{searchQuery}</span>"
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Graphic: Floating Animated Astronaut Motif */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Outer Glowing Orbital Rings */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border border-indigo-500/15 border-dashed animate-reverse-spin"></div>
                
                {/* Floating Miniature Planet */}
                <div className="absolute -top-4 -right-2 w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center animate-bounce">
                  <div className="w-10 h-2 bg-purple-950/40 rounded-full transform -rotate-12"></div>
                </div>

                {/* Floating Moon */}
                <div className="absolute bottom-4 -left-4 w-8 h-8 bg-slate-700 rounded-full shadow-md border border-slate-600 animate-pulse"></div>

                {/* Astronaut Graphic Container */}
                <div className="relative z-10 p-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center text-center transform hover:scale-105 transition duration-500">
                  
                  {/* Floating SVG Astronaut Illustration */}
                  <div className="w-40 h-40 relative animate-float">
                    <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-2xl">
                      {/* Backpack */}
                      <rect x="70" y="80" width="100" height="90" rx="15" fill="#334155" />
                      
                      {/* Body */}
                      <rect x="80" y="90" width="80" height="100" rx="20" fill="#F8FAFC" />
                      <rect x="95" y="110" width="50" height="35" rx="8" fill="#1E293B" />
                      
                      {/* Chest Control Lights */}
                      <circle cx="107" cy="122" r="3" fill="#EF4444" />
                      <circle cx="120" cy="122" r="3" fill="#10B981" />
                      <circle cx="133" cy="122" r="3" fill="#3B82F6" />

                      {/* Helmet */}
                      <circle cx="120" cy="75" r="45" fill="#F1F5F9" />
                      {/* Visor */}
                      <path d="M 90 70 Q 120 45 150 70 Q 150 95 120 95 Q 90 95 90 70 Z" fill="url(#visorGradient)" />
                      
                      {/* Visor Reflection */}
                      <path d="M 100 65 Q 115 55 130 62" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

                      {/* Arms */}
                      <path d="M 80 105 Q 55 120 65 140" stroke="#F1F5F9" strokeWidth="16" strokeLinecap="round" fill="none" />
                      <path d="M 160 105 Q 185 120 175 140" stroke="#F1F5F9" strokeWidth="16" strokeLinecap="round" fill="none" />

                      {/* Thruster Flames */}
                      <path d="M 100 190 Q 120 220 140 190" fill="#F97316" className="animate-pulse" />

                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="50%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Status Report</span>
                    <h3 className="text-slate-200 font-medium text-sm mt-1">Drifting in Sector 404</h3>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* Easter Egg Mini Game Screen */
          <div className="max-w-3xl mx-auto w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Cosmic Defender 404
                </h2>
                <p className="text-xs text-slate-400">Use Left / Right Arrows (or A/D) to move. Spacebar to shoot asteroids!</p>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400">Score:</span>
                  <span className="font-bold text-white">{score}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-400">Best:</span>
                  <span className="font-bold text-amber-400">{highScore}</span>
                </div>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas ref={canvasRef} className="w-full h-80 block cursor-crosshair" />

              {/* Start / Game Over Overlay */}
              {(!gamePlaying || gameOver) && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
                  {gameOver ? (
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-red-400">Mission Failed!</h3>
                      <p className="text-slate-300 text-sm">Your ship collided with cosmic debris.</p>
                      <p className="text-purple-400 font-semibold text-lg">Final Score: {score}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-w-sm">
                      <div className="w-12 h-12 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100">Blast Away the 404 Debris!</h3>
                      <p className="text-xs text-slate-400">Clear space rocks while you wait for assistance or find your destination link.</p>
                    </div>
                  )}

                  <button
                    onClick={startGame}
                    className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition transform hover:scale-105"
                  >
                    {gameOver ? 'Try Again' : 'Start Mission'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Sitemap Links Grid */}
        <div className="mt-16 pt-12 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Recommended Destinations</h3>
              <p className="text-xs text-slate-400">Frequently visited pages to get you back on track</p>
            </div>
            <span className="text-xs text-purple-400 font-medium">Sitemap Directory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="group relative p-4 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-800/80 group-hover:bg-purple-600/20 text-purple-400 group-hover:text-purple-300 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {link.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                          {link.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {link.desc}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Visit Page</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CosmicNav Engine. All galactic rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#support" className="hover:text-slate-400 transition">System Status</a>
          </div>
        </div>
      </footer>

      {/* Keyframe Animation Styles for Floating Elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes reverseSpin {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 25s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverseSpin 20s linear infinite;
        }
      `}</style>
    </div>
  );
}