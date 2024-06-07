import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const storeAnimated = create(
    subscribeWithSelector((set, get) => ({
     // CHARACTER CONTROLLER
     characterState: "Idle",
     setCharacterState: (characterState) =>
       set({
         characterState,
       }),
    }))
);