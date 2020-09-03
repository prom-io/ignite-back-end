import { RewardFractions } from "./types";
import _ from "lodash"

export const rewardFractionsForFirstPlace: RewardFractions = {
  rewardFractionForAuthor: 0.10,
  rewardFractionToEqualyShareBetweenEveryVoter: 0.12,
  rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.18,
  rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.138,
  rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.09,
  rewardFractionFor1stRandomVoter: 0.03,
  rewardFractionFor2ndRandomVoter: 0.024,
  rewardFractionFor3rdRandomVoter: 0.018,
};

export const rewardFractionsForSecondPlace: RewardFractions = {
  rewardFractionForAuthor: 0.06,
  rewardFractionToEqualyShareBetweenEveryVoter: 0.02,
  rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.03,
  rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.023,
  rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.015,
  rewardFractionFor1stRandomVoter: 0.005,
  rewardFractionFor2ndRandomVoter: 0.004,
  rewardFractionFor3rdRandomVoter: 0.003,
};

export const rewardFractionsForThirdsPlace: RewardFractions = {
  rewardFractionForAuthor: 0.04,
  rewardFractionToEqualyShareBetweenEveryVoter: 0.02,
  rewardFractionToEqualyShareBetweenEvery2ndRandomVoter: 0.03,
  rewardFractionToEqualyShareBetweenEvery4thRandomVoter: 0.023,
  rewardFractionToEqualyShareBetweenEvery20thRandomVoter: 0.015,
  rewardFractionFor1stRandomVoter: 0.005,
  rewardFractionFor2ndRandomVoter: 0.004,
  rewardFractionFor3rdRandomVoter: 0.003,
};

export const overallRewardFractionForFirstPlace: number = _.round(_.sum(_.values(rewardFractionsForFirstPlace)), 3);
export const overallRewardFractionForSecondPlace: number = _.round(_.sum(_.values(rewardFractionsForSecondPlace)), 3);
export const overallRewardFractionForThirdPlace: number = _.round(_.sum(_.values(rewardFractionsForThirdsPlace)), 3);
