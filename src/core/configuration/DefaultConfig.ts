import {Player, PlayerInfo, TerraNullius, Tile} from "../Game";
import {within} from "../Util";
import {Config, Theme} from "./Config";
import {pastelTheme} from "./PastelTheme";



export class DefaultConfig implements Config {
    boatMaxNumber(): number {
        return 3
    }
    boatMaxDistance(): number {
        return 500
    }
    numSpawnPhaseTurns(): number {
        return 100
    }
    numBots(): number {
        return 250
    }
    turnIntervalMs(): number {
        return 100
    }
    gameCreationRate(): number {
        return 20 * 1000
    }
    lobbyLifetime(): number {
        return 20 * 1000
    }
    theme(): Theme {return pastelTheme;}

    attackLogic(attacker: Player, defender: Player | TerraNullius, tileToConquer: Tile): {attackerTroopLoss: number; defenderTroopLoss: number; tilesPerTickUsed: number} {
        if (defender.isPlayer()) {
            return {
                attackerTroopLoss: Math.min(defender.troops() / 2000, 10) + tileToConquer.magnitude(),
                defenderTroopLoss: Math.min(attacker.troops() / 3000, 5),
                tilesPerTickUsed: tileToConquer.magnitude() + 1
            }
        } else {
            return {
                attackerTroopLoss: tileToConquer.magnitude(),
                defenderTroopLoss: 0,
                tilesPerTickUsed: tileToConquer.magnitude() + 1
            }
        }
    }

    attackTilesPerTick(attacker: Player, defender: Player | TerraNullius, numAdjacentTilesWithEnemy: number): number {
        if (defender.isPlayer()) {
            return within(attacker.numTilesOwned() / defender.numTilesOwned() * 2, .01, .5) * numAdjacentTilesWithEnemy
        } else {
            return numAdjacentTilesWithEnemy
        }
    }

    boatAttackAmount(attacker: Player, defender: Player | TerraNullius): number {
        return attacker.troops() / 5
    }

    attackAmount(attacker: Player, defender: Player | TerraNullius) {
        if (attacker.isBot()) {
            return attacker.troops() / 20
        } else {
            return attacker.troops() / 5
        }
    }

    startTroops(playerInfo: PlayerInfo): number {
        if (playerInfo.isBot) {
            return 5000
        }
        return 5000
    }

    troopAdditionRate(player: Player): number {
        let max = Math.sqrt(player.numTilesOwned()) * 1000 + 10000 + 100000
        max = Math.min(max, 1_000_000)

        let toAdd = 10 + (player.troops() + Math.sqrt(player.troops() * player.numTilesOwned())) / 250

        return Math.min(player.troops() + toAdd, max)
    }
}


export const defaultConfig = new DefaultConfig()