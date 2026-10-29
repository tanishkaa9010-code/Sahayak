export interface CountdownResult {
  formattedText: string;
  isOverdue: boolean;
  daysRemaining: number;
  urgencyLevel: 'urgent' | 'moderate' | 'relaxed';
}

export function calculateCountdown(dateString: string): CountdownResult {
  if (!dateString) {
    return {
      formattedText: 'No specific date',
      isOverdue: false,
      daysRemaining: 999,
      urgencyLevel: 'relaxed',
    };
  }

  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) {
    return {
      formattedText: dateString,
      isOverdue: false,
      daysRemaining: 999,
      urgencyLevel: 'relaxed',
    };
  }

  const now = new Date();
  // Clear hours for day-level comparison
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffMs = targetDay.getTime() - nowDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      formattedText: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}!`,
      isOverdue: true,
      daysRemaining: diffDays,
      urgencyLevel: 'urgent',
    };
  } else if (diffDays === 0) {
    return {
      formattedText: 'DUE TODAY',
      isOverdue: false,
      daysRemaining: 0,
      urgencyLevel: 'urgent',
    };
  } else if (diffDays === 1) {
    return {
      formattedText: 'Due Tomorrow (1 day left)',
      isOverdue: false,
      daysRemaining: 1,
      urgencyLevel: 'urgent',
    };
  } else if (diffDays <= 3) {
    return {
      formattedText: `Due in ${diffDays} days`,
      isOverdue: false,
      daysRemaining: diffDays,
      urgencyLevel: 'urgent',
    };
  } else if (diffDays <= 7) {
    return {
      formattedText: `Due in ${diffDays} days`,
      isOverdue: false,
      daysRemaining: diffDays,
      urgencyLevel: 'moderate',
    };
  } else {
    return {
      formattedText: `Due in ${diffDays} days`,
      isOverdue: false,
      daysRemaining: diffDays,
      urgencyLevel: 'relaxed',
    };
  }
}
