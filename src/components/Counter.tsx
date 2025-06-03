"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer({
	onTimerEnd,
	targetDate,
}: { onTimerEnd: (v: boolean) => void; targetDate: Date }) {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	// const targetDate = new Date().setDate(new Date().getDate()+14);

	const calculateTimeLeft = () => {
		const difference = +targetDate - +new Date();

		if ((difference < 1200 && difference > 1) || difference < 0) {
			setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			onTimerEnd(true);
			return;
		}

		setTimeLeft({
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / 1000 / 60) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		});
	};

	useEffect(() => {
		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="grid grid-cols-4 gap-2 text-center text-background w-fit">
			<TimeUnit value={timeLeft.days} label="Days" />
			<TimeUnit value={timeLeft.hours} label="Hours" />
			<TimeUnit value={timeLeft.minutes} label="Minutes" />
			<TimeUnit value={timeLeft.seconds} label="Seconds" />
		</div>
	);
}

function TimeUnit({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex gap-x-2 flex-col md:flex-row-reverse items-center">
			<div className="relative w-full">
				<div className="bg-primary/40 rounded-md w-12 py-1.5 my-2 relative overflow-hidden">
					<span className=" font-bold tabular-nums animate-in slide-in-from-bottom-2 duration-300">
						{value.toString().padStart(2, "0")}
					</span>
				</div>
			</div>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}
