function getHomeTeamName(name) {
  // console.log('name', name);

  switch (name) {
    case 'Maidenhead United':
      return 'Maidenhead Utd';
    case 'Sheffield United':
      return 'Sheff Utd';
    case 'Sheffield Utd':
      return 'Sheff Utd';
    case 'Tala\'ea El Gaish':
      return 'Tala Al Jaish';
    default:
      console.log('нет таких названий команд');
  }
}



module.exports = { getHomeTeamName };
// export default db;
