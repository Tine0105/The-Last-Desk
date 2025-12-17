module last_deck::player {

    use sui::object;
    use sui::object::UID;
    use sui::tx_context;
    use sui::tx_context::TxContext;

    /// On-chain player save state. Minimal and gas-efficient.
    public struct PlayerState has key {
        id: UID,
        owner: address,
        level: u64,
        gold: u64,
        seed: u64,
        last_updated: u64,
    }

    /// Create a new PlayerState object owned by the transaction sender.
    /// Note: preventing multiple PlayerState objects per wallet requires
    /// an on-chain registry (not included here). Frontend should query
    /// existing PlayerState objects and avoid calling `create_player`
    /// if one already exists for the connected wallet.
    public fun create_player(ctx: &mut TxContext): PlayerState {
        let owner = tx_context::sender(ctx);

        PlayerState {
            id: object::new(ctx),
            owner: owner,
            level: 1,
            gold: 0,
            seed: 0,
            last_updated: 0,
        }
    }

    /// Update an existing PlayerState. Only the owner may call this.
    /// `last_updated` is provided by the caller (e.g., Date.now()).
    public fun update_player(
        player: &mut PlayerState,
        level: u64,
        gold: u64,
        seed: u64,
        last_updated: u64,
        ctx: &TxContext
    ) {
        // Only the owner can update their save
        assert!(player.owner == tx_context::sender(ctx), 1);

        player.level = level;
        player.gold = gold;
        player.seed = seed;
        player.last_updated = last_updated;
    }

    /// Read-only helper to return core fields: level, gold, seed
    public fun get_player(player: &PlayerState): (u64, u64, u64) {
        (player.level, player.gold, player.seed)
    }
}
