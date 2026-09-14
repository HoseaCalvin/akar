export const getDuration = (startTime: string, endTime: string) => {
  const ms = new Date(endTime).getTime() - new Date(startTime).getTime();

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}

export const getMilitaryTime = (time: string) => {
  return new Date(time).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
}