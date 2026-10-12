import React from 'react';

const BenchPressIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="4" cy="14" r="2"/><path d="M6 14h10"/><path d="M16 14l2-2 2 2"/><path d="M11 14V6"/><path d="M7 6h8"/>
  </svg>
);

const InclinePressIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="4" cy="17" r="2"/><path d="M6 16l7-6"/><path d="M13 9l3 3-2 3"/><path d="M10 12l3-6"/><circle cx="14" cy="5" r="1.4"/>
  </svg>
);

const PullUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16"/><circle cx="12" cy="8" r="2"/><path d="M9 5l3 3 3-3"/><path d="M12 10v6"/><path d="M9 20l3-4 3 4"/>
  </svg>
);

const RowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="7" r="2"/><path d="M18 9l-8 6"/><path d="M14 12H9"/><path d="M10 15l-2 5"/><path d="M10 15l2 5"/><circle cx="7" cy="12" r="1.4"/>
  </svg>
);

const OverheadPressIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M12 15l-3 5"/><path d="M12 15l3 5"/><path d="M12 8l-5-5"/><path d="M12 8l5-5"/><path d="M6 3h12"/>
  </svg>
);

const LateralRaiseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M12 15l-3 5"/><path d="M12 15l3 5"/><path d="M12 9H4"/><path d="M12 9h8"/>
  </svg>
);

const BicepCurlIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M12 15l-3 5"/><path d="M12 15l3 5"/><path d="M12 9l4 3"/><path d="M16 12l-2-5"/><circle cx="14" cy="7" r="1.2"/><path d="M12 9l-3 6"/>
  </svg>
);

const TricepsPushdownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="M12 15l-3 5"/><path d="M12 15l3 5"/><path d="M12 9l3 2"/><path d="M15 11v6"/><path d="M12 9l-3 6"/>
  </svg>
);

const SquatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2"/><path d="M7 6h10"/><path d="M12 6v6"/><path d="M12 12l-4 3v5"/><path d="M12 12l4 3v5"/>
  </svg>
);

const DeadliftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15" cy="5" r="2"/><path d="M15 7l-6 7"/><path d="M9 14v6"/><path d="M9 14l3 6"/><path d="M13 9l-4 8"/><path d="M7 17h4"/>
  </svg>
);

const CalfRaiseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2"/><path d="M12 6v8"/><path d="M12 14l-2 5"/><path d="M12 14l2 5"/><path d="M9 19l2-1"/><path d="M15 19l-2-1"/><path d="M6 21h12" strokeDasharray="1 2"/>
  </svg>
);

const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 8.5L3 12l3.5 3.5"/><path d="M17.5 15.5L21 12l-3.5-3.5"/><path d="M12 2v20"/><path d="M12 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2"/><path d="M12 2h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2"/>
  </svg>
);

export const exerciseIcons: Record<string, React.FC> = {
  'Bench Press': BenchPressIcon,
  'Incline Dumbbell Press': InclinePressIcon,
  'Cable Chest Flyes': BenchPressIcon,
  'Arnold Press': OverheadPressIcon,
  'Pull-Ups': PullUpIcon,
  'Lat Pulldowns': PullUpIcon,
  'Barbell Rows': RowIcon,
  'Seated Cable Rows': RowIcon,
  'Overhead Press': OverheadPressIcon,
  'Lateral Raises': LateralRaiseIcon,
  'Face Pulls': OverheadPressIcon,
  'Bicep Curls': BicepCurlIcon,
  'Hammer Curls': BicepCurlIcon,
  'Triceps Pushdowns': TricepsPushdownIcon,
  'Skull Crushers': TricepsPushdownIcon,
  'Squats': SquatIcon,
  'Bulgarian Split Squats': SquatIcon,
  'Romanian Deadlifts': DeadliftIcon,
  'Lying Leg Curls': DeadliftIcon,
  'Calf Raises': CalfRaiseIcon,
  'Hanging Leg Raises': PullUpIcon,
  'Hip Thrusts': DeadliftIcon,
};

export const getIcon = (exerciseName: string) => {
  return exerciseIcons[exerciseName] || DumbbellIcon;
};
