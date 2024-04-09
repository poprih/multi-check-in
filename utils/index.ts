export const getters = {
  get lastestSunday() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const daysUntilNextSunday = 7 - currentDay;
    const lastestSunday = new Date(
      currentDate.getTime() + daysUntilNextSunday * 24 * 60 * 60 * 1000
    );
    return lastestSunday.toISOString().split("T")[0];
  },
};
