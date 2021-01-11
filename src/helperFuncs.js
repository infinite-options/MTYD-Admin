// Function to get date/time in better format
// Expected input format: YYYY-MM-DD HH-MM-SS
// Returned output format: YYYY-MM-DD HH:MM:SS
export const formatTime = (time) => {
  return `${time.slice(0, 13)}:${time.slice(14, 16)}:${time.slice(17, 19)}`;
}