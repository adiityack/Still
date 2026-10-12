import { localRepository } from './localRepository';

export async function getOnboardingCompleted() {
  return localRepository.getOnboardingCompleted();
}

export async function setOnboardingCompleted(completed: boolean) {
  return localRepository.setOnboardingCompleted(completed);
}
