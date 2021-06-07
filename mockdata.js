/**
 * mockdata.js
 *
 * @file  Dummy data
 * @author Tomás Sánchez
 * @since  05.31.2021
 */

/**
 * Generates a random number between 0 and the current year.
 *
 * @returns A random number
 */
const randomIdNumber = () => {
  return Math.floor(Math.random() * (new Date().getFullYear() + 1));
};

/**
 * Mockdata for Old Reddit.
 */
const mockdata = {
  password: "p@s$w0rd_(R3)P0leN74",
  user: `rTest${randomIdNumber()}Captcha`,
};

export default mockdata;
