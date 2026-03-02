import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Mail, Image as ImageIcon, Gift, Delete, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type Screen = 'password' | 'menu' | 'letter' | 'music' | 'image' | 'gift';

// --- Components ---

const FloatingHearts = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-green-300 opacity-40"
                    initial={{ y: '100vh', x: `${Math.random() * 100}vw`, scale: Math.random() * 0.5 + 0.5 }}
                    animate={{ y: '-20vh', rotate: 360 }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 20
                    }}
                >
                    <Heart fill="currentColor" size={Math.random() * 30 + 10} />
                </motion.div>
            ))}
        </div>
    );
};

const PasswordScreen = ({ onCorrect }: { onCorrect: () => void }) => {
    const [code, setCode] = useState('');
    const [isError, setIsError] = useState(false);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const SECRET = 'Anh Yêu Em';

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientY - top - height / 2) / 20;
        const y = (clientX - left - width / 2) / -20;
        setRotate({ x, y });
        setMousePos({ x: clientX - left, y: clientY - top });
    };

    const handleSubmit = (val: string) => {
        const normalizedInput = val.trim().toLowerCase();
        const normalizedSecret = SECRET.toLowerCase();

        if (normalizedInput === normalizedSecret) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff85a1', '#fbb1bd', '#f25c7e']
            });
            setTimeout(onCorrect, 600);
        } else {
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
                setCode('');
            }, 800);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(code);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
                opacity: 1,
                y: 0,
                rotateX: rotate.x,
                rotateY: rotate.y
            }}
            exit={{
                opacity: 0,
                scale: 0.9,
                filter: 'blur(20px)',
                transition: { duration: 0.4, ease: "backIn" }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotate({ x: 0, y: 0 })}
            className={`glass-effect custom-shadow rounded-[40px] p-6 md:p-10 flex flex-col md:flex-row gap-8 max-w-4xl w-full mx-4 relative overflow-hidden group/card ${isError ? 'animate-shake' : ''}`}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 70px rgba(76, 175, 80, 0.4)'
            }}
        >
            <div
                className="absolute pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-full w-[400px] h-[400px]"
                style={{
                    background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%)',
                    left: mousePos.x - 200,
                    top: mousePos.y - 200,
                    zIndex: 0
                }}
            />

            <div className="w-full md:w-1/2 h-64 md:h-[400px] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img src="/Home.jpg" alt="Home" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10 p-4">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-accent underline decoration-pink-300">
                    <Heart fill="currentColor" size={48} />
                </motion.div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-accent tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>Anh hay nói với em câu gì?</h2>
                    <p className="text-sm text-gray-500 font-medium">Nhập mật mật khẩu để mở món quà bí mật</p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập vào đây..."
                            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border-2 border-accent/20 focus:border-accent outline-none text-center text-xl font-semibold text-accent transition-all duration-300 placeholder:text-gray-400/60 shadow-inner"
                            autoFocus
                        />
                        {isError && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-500 font-bold uppercase tracking-tighter">
                                Mật khẩu không đúng rồi em ơi!
                            </motion.p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit(code)}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-100/50 hover:bg-[#66bb6a] transition-all duration-300"
                    >
                        MỞ QUÀ NGAY ✨
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const MenuScreen = ({ onSelect, onBack }: { onSelect: (s: Screen) => void, onBack: () => void }) => {
    const options = [
        { id: 'music', label: 'Music', icon: <Music size={40} />, color: 'bg-green-100' },
        { id: 'letter', label: 'Letter', icon: <Mail size={40} />, color: 'bg-emerald-100' },
        { id: 'image', label: 'Image', icon: <ImageIcon size={40} />, color: 'bg-lime-100' },
        { id: 'gift', label: 'Gift', icon: <Gift size={40} />, color: 'bg-teal-100' },
    ];

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
            <div className="grid grid-cols-2 gap-6 w-full">
                {options.map((opt, i) => (
                    <motion.div
                        key={opt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, translateY: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(opt.id as Screen)}
                        className="glass-effect p-8 rounded-[35px] flex flex-col items-center justify-center gap-4 cursor-pointer custom-shadow group border-white/40"
                    >
                        <div className={`p-4 rounded-2xl ${opt.color} text-accent group-hover:rotate-12 transition-transform duration-300`}>
                            {opt.icon}
                        </div>
                        <span className="text-xl font-semibold text-accent">{opt.label}</span>
                    </motion.div>
                ))}
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05, x: -5 }}
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-2 rounded-full glass-effect text-accent font-medium hover:bg-white/60 transition-colors shadow-sm"
            >
                <ChevronLeft size={20} /> Trở lại
            </motion.button>
        </div>
    );
};

const LetterOverlay = ({ onClose }: { onClose: () => void }) => {
    const message = "Hôm nay là một ngày đặc biệt, và anh muốn dành những điều tuyệt vời nhất cho em. Chúc em mãi mãi rạng rỡ như những bông hoa, mạnh mẽ và hạnh phúc trên con đường mình chọn. Cảm ơn em đã xuất hiện và làm cuộc sống trở nên rực rỡ hơn, Anh Yêu Em 💖";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-6 cursor-pointer"
        >
            <motion.div
                initial={{ scale: 0.8, y: 50, rotate: -2 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-lg w-full bg-[#fff9fa] rounded-[30px] p-8 md:p-12 shadow-2xl relative overflow-hidden border-[12px] border-white cursor-default"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100/50 rounded-full -ml-16 -mb-16 blur-3xl" />

                {/* Letter Header */}
                <div className="flex flex-col items-center mb-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-pink-300 mb-2"
                    >
                        <Heart fill="currentColor" size={32} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-pink-500 tracking-tight text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Gửi Đến Em Người Anh Thương 🍀</h2>
                    <div className="w-24 h-0.5 bg-pink-100 mt-4" />
                </div>

                {/* Letter Body */}
                <div className="relative min-h-[180px]">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg leading-relaxed text-gray-700 italic text-center whitespace-pre-wrap font-medium"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                        {message}
                    </motion.p>
                </div>

                {/* Signature/Seal */}
                <div className="mt-12 flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 1.2
                        }}
                        className="w-16 h-16 rounded-full border-2 border-pink-200 flex items-center justify-center text-pink-300 rotate-12"
                    >
                        <span className="font-bold text-3xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>Love</span>
                    </motion.div>

                    <button
                        onClick={onClose}
                        className="mt-4 px-10 py-3 bg-pink-100 hover:bg-pink-200 text-pink-500 rounded-full font-bold transition-all duration-300 shadow-sm text-sm tracking-widest uppercase"
                    >
                        Đóng lại
                    </button>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 text-pink-100 opacity-50">✦</div>
                <div className="absolute bottom-4 right-4 text-pink-100 opacity-50">✦</div>
            </motion.div>
        </motion.div>
    );
};

const MusicPlayer = ({ onClose }: { onClose: () => void }) => {
    const playlist = [
        {
            title: "Sao Anh Chưa Về Nhà",
            artist: "Amee",
            cover: "sao anh.jpg",
            url: "SAO ANH CHƯA VỀ.mp3"
        },
        {
            title: "Vườn mây vừa hay",
            artist: "Ân ngờ",
            cover: "/vườn.jpg", // Thay bằng tên file ảnh trong thư mục public
            url: "Vườn mây vừa hay.mp3"
        },
        {
            title: "Đợi",
            artist: "52Hz",
            cover: "/đợi.jpg", // Thay bằng tên file ảnh khác
            url: "Đợi.mp3"
        },
        {
            title: "Không Buông",
            artist: "Hngel",
            cover: "/ko.jpg",
            url: "Không Buông.mp3"
        },
    ];
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setCurrentTime(current);
            setDuration(dur);
            setProgress((current / dur) * 100);
        }
    };

    const handleTrackEnd = () => {
        if (currentTrack < playlist.length - 1) {
            setCurrentTrack(currentTrack + 1);
        } else {
            setIsPlaying(false);
            setProgress(0);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-md cursor-pointer"
        >
            <audio
                ref={audioRef}
                src={playlist[currentTrack].url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnd}
                onLoadedMetadata={handleTimeUpdate}
            />
            <div
                onClick={(e) => e.stopPropagation()}
                className="glass-effect w-full max-w-[320px] rounded-[40px] p-5 custom-shadow relative border border-white/40 cursor-default"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-accent font-bold tracking-wider text-xs">
                        <Music size={16} />
                        MUSIC PLAYER
                    </div>
                    <button onClick={onClose} className="bg-accent text-white rounded-full p-1 hover:scale-110 transition-transform shadow-sm">
                        <div className="w-4 h-4 flex items-center justify-center text-[10px]">✕</div>
                    </button>
                </div>

                {/* Cover & Info */}
                <div className="flex flex-col items-center mb-4">
                    <motion.div
                        animate={isPlaying ? { rotate: 360 } : {}}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full overflow-hidden shadow-xl mb-3 border-2 border-white/60 ring-4 ring-pink-100/30"
                    >
                        <img src={playlist[currentTrack].cover} className="w-full h-full object-cover" alt="Cover" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-accent text-center truncate w-full px-2">{playlist[currentTrack].title}</h3>
                    <p className="text-accent/60 text-xs font-medium">{playlist[currentTrack].artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-4 px-1">
                    <div className="flex justify-between text-[9px] text-accent/60 mb-1 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration || 0)}</span>
                    </div>
                    <div className="w-full h-1 bg-white/40 rounded-full relative overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "tween", ease: "linear" }}
                            className="absolute top-0 left-0 h-full bg-accent"
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-6 mb-6">
                    <button className="text-accent/60 hover:text-accent disabled:opacity-30 p-1"
                        onClick={() => { setCurrentTrack(t => Math.max(0, t - 1)); setIsPlaying(true); }}
                        disabled={currentTrack === 0}>
                        <div className="w-5 h-5 rotate-180"><PlayIcon fill="currentColor" /></div>
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all ring-2 ring-green-100"
                    >
                        {isPlaying ? (
                            <div className="flex gap-1">
                                <div className="w-1 h-5 bg-white rounded-full" />
                                <div className="w-1 h-5 bg-white rounded-full" />
                            </div>
                        ) : (
                            <PlayIcon fill="white" className="ml-0.5" size={20} />
                        )}
                    </button>
                    <button className="text-accent/60 hover:text-accent disabled:opacity-30 p-1"
                        onClick={() => { setCurrentTrack(t => Math.min(playlist.length - 1, t + 1)); setIsPlaying(true); }}
                        disabled={currentTrack === playlist.length - 1}>
                        <PlayIcon fill="currentColor" size={20} />
                    </button>
                </div>

                {/* Playlist */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0 custom-scrollbar-hidden">
                    {playlist.map((track, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, x: 3 }}
                            onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${i === currentTrack ? 'bg-accent/10 border border-accent/10 shadow-sm' : 'hover:bg-white/30'}`}
                        >
                            <img src={track.cover} className="w-9 h-9 rounded-lg object-cover shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${i === currentTrack ? 'text-accent' : 'text-accent/80'}`}>{track.title}</p>
                                <p className="text-[9px] text-accent/50 truncate font-medium">{track.artist}</p>
                            </div>
                            {i === currentTrack && isPlaying && (
                                <div className="flex items-end gap-0.5 h-2.5">
                                    <div className="w-0.5 h-1.5 bg-accent animate-bounce" />
                                    <div className="w-0.5 h-2.5 bg-accent animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-0.5 h-1 bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const PhotoGallery = ({ onClose }: { onClose: () => void }) => {
    const isMobile = window.innerWidth < 768;
    const images = [
        { url: "cá tính.jpg", title: "Cá tính" },
        { url: "cuốn hút.jpg", title: "Cuốn hút" },
        { url: "đáng iu.jpg", title: "Đáng yêu" },
        { url: "cuốn người.jpg", title: "Cuốn Người" },
        { url: "suy tư.jpg", title: "Suy Tư" },
        { url: "tò mò.jpg", title: "Tò Mò" },
        { url: "xinh.jpg", title: "Xinh" },
        { url: "quậy.jpg", title: "Quậy" },
    ];

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile) return;
        const { clientX, clientY } = e;
        setMousePos({
            x: (clientX / window.innerWidth - 0.5) * 40,
            y: (clientY / window.innerHeight - 0.5) * 40,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-[2000] flex flex-col p-4 overflow-hidden cursor-pointer"
            onMouseMove={handleMouseMove}
            onClick={onClose}
        >
            {/* Simplified Header for Mobile */}
            <div className="w-full flex justify-end pb-4 pt-2 relative z-[3000]" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-xl border border-white/20 active:scale-90 transition-transform cursor-pointer"
                >
                    ✕
                </button>
            </div>


            {isMobile ? (
                /* Premium Mobile Album Grid - Optimized but beautiful */
                <div className="flex-1 overflow-y-auto custom-scrollbar-hidden px-2 pb-24">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {images.map((img, i) => {
                            // Subtle random tilt for mobile scrapbook feel
                            const randomTilt = (i % 2 === 0 ? 1 : -1) * (3 + (i * 2) % 5);

                            return (
                                <motion.div
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 30, scale: 0.9, rotate: 0 },
                                        visible: { opacity: 1, y: 0, scale: 1, rotate: randomTilt }
                                    }}
                                    whileTap={{ scale: 0.95, rotate: 0 }}
                                    className="bg-white p-2 pb-10 shadow-xl rounded-sm group relative"
                                >
                                    <div className="aspect-[4/5] overflow-hidden rounded-sm bg-gray-50 mb-2">
                                        <img
                                            src={img.url}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            alt={img.title}
                                        />
                                    </div>
                                    <p className="absolute bottom-2 left-0 right-0 text-center font-handwriting text-gray-800 text-base opacity-90 truncate px-2">
                                        {img.title}
                                    </p>
                                    {/* Subtle photo corner detail */}
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-black/5 rounded-bl-full pointer-events-none" />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>


            ) : (
                /* Original scattered parallax for Desktop - Spreading across full screen */
                <div
                    className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden"
                >
                    {images.map((img, i) => {
                        const randomRotation = (i % 2 === 0 ? 1 : -1) * (15 + (i * 8) % 20);
                        const angle = (i / images.length) * Math.PI * 2;

                        // Use dynamic radius based on window size with a safety margin to avoid clipping
                        const radiusX = (window.innerWidth * 0.35) + (i % 2) * 50;
                        const radiusY = (window.innerHeight * 0.35) + (i % 2) * 50;
                        const initialX = Math.cos(angle) * radiusX;
                        const initialY = Math.sin(angle) * radiusY;

                        const isHovered = hoveredIndex === i;
                        const isAnythingHovered = hoveredIndex !== null;

                        return (
                            <motion.div
                                key={i}
                                onHoverStart={() => setHoveredIndex(i)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                onClick={(e) => e.stopPropagation()}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: isAnythingHovered && !isHovered ? 0.1 : 1,
                                    filter: isAnythingHovered && !isHovered ? 'blur(15px) grayscale(1)' : 'blur(0px) grayscale(0)',
                                    x: isHovered ? 0 : (initialX + mousePos.x * (1 + i * 0.15)),
                                    y: isHovered ? 0 : (initialY + mousePos.y * (1 + i * 0.15)),
                                    rotate: isHovered ? 0 : randomRotation,
                                    scale: isHovered ? 1.8 : 1,
                                    zIndex: isHovered ? 1000 : i,
                                }}
                                transition={{
                                    type: "spring", stiffness: isHovered ? 120 : 80, damping: isHovered ? 20 : 15,
                                }}
                                className="absolute pointer-events-auto cursor-default"
                            >
                                <div className={`relative overflow-hidden group transition-all duration-500 rounded-lg ${isHovered ? 'shadow-[0_40px_100px_rgba(0,0,0,0.8)] scale-110' : 'shadow-2xl'}`}>
                                    <div className="w-52 md:w-64 h-64 md:h-80 overflow-hidden bg-gray-900">
                                        <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                                    </div>
                                    {/* Hover Title Overlay */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                                        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center"
                                    >
                                        <p className="font-handwriting text-xl">{img.title}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};


const DetailedFlower = ({ delay = 0, color = "#ff85a1", size = 120 }) => {
    // 8 petals for each layer
    const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    const innerPetalAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                delay: delay,
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="relative"
            style={{ width: size, height: size }}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <defs>
                    <radialGradient id={`petal-grad-${color.replace('#', '')}`} cx="50%" cy="100%" r="100%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="70%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
                    </radialGradient>
                    <radialGradient id={`center-grad-${color.replace('#', '')}`}>
                        <stop offset="0%" stopColor="#ffeb3b" />
                        <stop offset="60%" stopColor="#f9a825" />
                        <stop offset="100%" stopColor="#e65100" />
                    </radialGradient>
                </defs>

                {/* Outer Petals */}
                {petalAngles.map((angle, i) => (
                    <motion.path
                        key={`outer-${i}`}
                        d="M100,105 C120,60 160,50 100,20 C40,50 80,60 100,105"
                        fill={`url(#petal-grad-${color.replace('#', '')})`}
                        initial={{ scale: 0, rotate: angle }}
                        animate={{ scale: 1, rotate: angle }}
                        transition={{
                            delay: delay + 0.4 + i * 0.1,
                            duration: 1.8,
                            ease: "easeOut"
                        }}
                        style={{ originX: "100px", originY: "100px" }}
                    />
                ))}

                {/* Inner Petals */}
                {innerPetalAngles.map((angle, i) => (
                    <motion.path
                        key={`inner-${i}`}
                        d="M100,100 C115,70 135,65 100,45 C65,65 85,70 100,100"
                        fill={color}
                        opacity="0.9"
                        initial={{ scale: 0, rotate: angle }}
                        animate={{ scale: 0.8, rotate: angle }}
                        transition={{
                            delay: delay + 1.2 + i * 0.08,
                            duration: 1.5,
                            ease: "easeOut"
                        }}
                        style={{ originX: "100px", originY: "100px" }}
                    />
                ))}

                {/* Flower Center */}
                <motion.circle
                    cx="100" cy="100" r="16"
                    fill={`url(#center-grad-${color.replace('#', '')})`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 2, duration: 1, type: "spring" }}
                />

                {/* Pollen Elements */}
                {[...Array(10)].map((_, i) => (
                    <motion.circle
                        key={`pollen-${i}`}
                        cx={100 + Math.cos(i * (Math.PI * 2 / 10)) * 12}
                        cy={100 + Math.sin(i * (Math.PI * 2 / 10)) * 12}
                        r="1.5"
                        fill="#fff"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.8, scale: 1 }}
                        transition={{ delay: delay + 2.5 + i * 0.05 }}
                    />
                ))}

                {/* Sparkling petals */}
                {[...Array(5)].map((_, i) => (
                    <motion.circle
                        key={`sparkle-${i}`}
                        cx={100 + (Math.random() - 0.5) * 120}
                        cy={100 + (Math.random() - 0.5) * 120}
                        r="1.2"
                        fill="white"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: delay + 3 + i * 0.5
                        }}
                    />
                ))}
            </svg>

            {/* Glowing Aura */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-200/20 blur-2xl rounded-full"
                style={{ transform: 'scale(0.5)' }}
            />
        </motion.div>
    );
};

const GiftOverlay = ({ onClose }: { onClose: () => void }) => {
    const isMobile = window.innerWidth < 768;

    const memoryItems = [
        { type: 'photo', url: "cá tính.jpg", text: "Cá tính" },
        { type: 'text', text: "Thương em nhiều lắm 🍀" },
        { type: 'photo', url: "cuốn hút.jpg", text: "Cuốn hút" },
        { type: 'text', text: "Mãi bên nhau nhé ✨" },
        { type: 'photo', url: "đáng iu.jpg", text: "Đáng yêu" },
        { type: 'text', text: "Hạnh phúc mỗi ngày 🥰" },
        { type: 'photo', url: "quậy.jpg", text: "Năng động" },
        { type: 'photo', url: "xinh.jpg", text: "Rạng rỡ" },
        { type: 'text', text: "Em là nhất 💖" },
        { type: 'photo', url: "cute.jpg", text: "Dễ thương" },
        { type: 'photo', url: "suy tư.jpg", text: "Suy tư" },
        { type: 'text', text: "Yêu em vô cùng 💋" },
        { type: 'photo', url: "tò mò.jpg", text: "Tò mò" },
        { type: 'photo', url: "cuốn người.jpg", text: "Hấp dẫn" },
        { type: 'text', text: "Mãi là duy nhất 💍" },
        { type: 'text', text: "Hẹn ước mai sau 🌹" },
    ];

    const starCount = isMobile ? 30 : 100;
    const fireflyCount = isMobile ? 8 : 25;
    const petalCount = isMobile ? 12 : 30;

    const flowerConfig = isMobile
        ? [
            { x: '15%', y: '20%', size: 100, color: '#ff85a1', delay: 0.2 },
            { x: '85%', y: '25%', size: 90, color: '#f06292', delay: 0.4 },
            { x: '20%', y: '80%', size: 110, color: '#ec407a', delay: 0.6 },
            { x: '80%', y: '75%', size: 95, color: '#f48fb1', delay: 0.8 },
        ]
        : [
            { x: '10%', y: '15%', size: 140, color: '#ff85a1', delay: 0.2 },
            { x: '85%', y: '20%', size: 120, color: '#f06292', delay: 0.4 },
            { x: '15%', y: '75%', size: 160, color: '#ec407a', delay: 0.6 },
            { x: '80%', y: '80%', size: 130, color: '#f48fb1', delay: 0.8 },
            { x: '50%', y: '10%', size: 100, color: '#ffb2c1', delay: 1.0 },
            { x: '45%', y: '85%', size: 150, color: '#ff80ab', delay: 1.2 },
            { x: '5%', y: '45%', size: 110, color: '#f06292', delay: 1.4 },
            { x: '90%', y: '55%', size: 140, color: '#ff4081', delay: 1.6 },
            { x: '30%', y: '25%', size: 90, color: '#f8bbd0', delay: 1.8 },
            { x: '70%', y: '35%', size: 110, color: '#f48fb1', delay: 2.0 },
            { x: '25%', y: '55%', size: 85, color: '#ff85a1', delay: 2.2 },
            { x: '75%', y: '65%', size: 120, color: '#f06292', delay: 2.4 },
            { x: '40%', y: '50%', size: 100, color: '#ec407a', delay: 2.6 },
            { x: '60%', y: '15%', size: 130, color: '#f8bbd0', delay: 2.8 },
        ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020a04] z-[2000] overflow-hidden"
        >
            {/* Starry Night Sky */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(starCount)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.1, 0.7, 0.1] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            {/* Fireflies effect */}
            <div className="absolute inset-0 z-[4] pointer-events-none">
                {[...Array(fireflyCount)].map((_, i) => (
                    <motion.div
                        key={`firefly-${i}`}
                        animate={{
                            x: [Math.random() * 100 + 'vw', Math.random() * 100 + 'vw'],
                            y: [Math.random() * 100 + 'vh', Math.random() * 100 + 'vh'],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{ duration: 12 + Math.random() * 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_5px_#fff]"
                    />
                ))}
            </div>

            {/* Realistic Blooming Flowers in Background */}
            <div className="absolute inset-0 z-[5] pointer-events-none">
                {flowerConfig.map((flower, i) => (
                    <div key={i} className="absolute" style={{ top: flower.y, left: flower.x, transform: 'translate(-50%, -50%)' }}>
                        <DetailedFlower color={flower.color} size={flower.size} delay={flower.delay} />
                    </div>
                ))}
            </div>

            {/* Falling Memories Layer */}
            <div className="absolute inset-0 z-[2100] pointer-events-none overflow-hidden">
                {memoryItems.map((item, i) => {
                    const startX = 10 + (i * 20) % 80;
                    const duration = 15 + Math.random() * 10;
                    const delay = i * 2;

                    return (
                        <motion.div
                            key={`memory-${i}`}
                            initial={{ top: '-40%', left: `${startX}%`, opacity: 0, scale: 0.8, rotate: -15 }}
                            animate={{
                                top: '120%',
                                rotate: [0, 360],
                                opacity: [0, 1, 1, 0],
                                scale: [0.8, 1, 1, 0.8]
                            }}
                            transition={{ duration: duration, delay: delay, repeat: Infinity, ease: "linear" }}
                            className="absolute flex items-center justify-center p-4 w-48 md:w-64"
                        >
                            {item.type === 'photo' ? (
                                <div className="p-1.5 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.8)] rounded-sm border-[2px] border-white w-full overflow-hidden">
                                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden rounded-[1px]">
                                        <img src={item.url} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
                                    </div>
                                </div>
                            ) : (
                                <div className="px-8 py-4 bg-white/20 backdrop-blur-3xl rounded-full border border-white/40 shadow-2xl">
                                    <span className="text-white font-bold text-lg drop-shadow-lg text-center whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        {item.text}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Falling Petals */}
            <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
                {[...Array(petalCount)].map((_, i) => (
                    <motion.div
                        key={`petal-${i}`}
                        animate={{ y: ['-10vh', '110vh'], x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`], rotate: 360, opacity: [0, 0.8, 0.8, 0] }}
                        transition={{ duration: 10 + Math.random() * 15, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
                        className="absolute w-3 h-5 bg-pink-300/30 rounded-full blur-[0.5px]"
                    />
                ))}
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 inset-x-0 h-40 z-[10] pointer-events-none flex items-end justify-between px-10 opacity-30 blur-[2px]">
                {[...Array(6)].map((_, i) => (
                    <motion.div key={i} animate={{ rotate: [-5, 5] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }} className="w-32 h-64 bg-green-950/60 rounded-full" style={{ transformOrigin: 'bottom center', borderRadius: '100% 0% 100% 0%', marginBottom: '-50px' }} />
                ))}
            </div>

            {/* UI - Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[3000] w-10 h-10 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-3xl border border-white/20 text-xl transition-all duration-500 shadow-xl"
            >
                ✕
            </button>
        </motion.div>
    );
};



const PlayIcon = ({ fill, className, size = 24 }: { fill?: string, className?: string, size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={fill || "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

// --- Main App ---

export default function App() {
    const [screen, setScreen] = useState<Screen>('password');
    const isOverlayActive = ['music', 'letter', 'image', 'gift'].includes(screen);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f9f1] relative p-4 overflow-hidden">
            <FloatingHearts />

            <AnimatePresence mode="wait">
                {screen === 'password' ? (
                    <PasswordScreen key="pass" onCorrect={() => setScreen('menu')} />
                ) : (screen === 'menu' || isOverlayActive) && (
                    <motion.div
                        key="menu-layer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: isOverlayActive ? 'blur(10px) brightness(0.9)' : 'blur(0px) brightness(1)',
                            pointerEvents: isOverlayActive ? 'none' : 'auto'
                        }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full flex items-center justify-center p-4"
                    >
                        <MenuScreen onSelect={(s) => setScreen(s)} onBack={() => setScreen('password')} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlays Layer */}
            <AnimatePresence>
                {screen === 'letter' && (
                    <LetterOverlay key="letter" onClose={() => setScreen('menu')} />
                )}
                {screen === 'music' && (
                    <MusicPlayer key="music" onClose={() => setScreen('menu')} />
                )}
                {screen === 'image' && (
                    <PhotoGallery key="gallery" onClose={() => setScreen('menu')} />
                )}
                {screen === 'gift' && (
                    <GiftOverlay key="gift" onClose={() => setScreen('menu')} />
                )}
            </AnimatePresence>

            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(242, 92, 126, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar-hidden {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </div>
    );
}
