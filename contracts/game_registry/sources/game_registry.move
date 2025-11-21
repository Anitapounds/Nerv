module game_registry::game_registry {
    use one::coin::{Self, Coin};
    use one::oct::OCT;
    use one::tx_context::{Self, TxContext};
    use one::clock::{Self, Clock};
    use one::transfer;
    use one::object::{Self, UID};

    // Error codes
    const EInsufficientFee: u64 = 0;

    // Fee: 0.1 OCT (100,000,000 in smallest unit)
    const FEE: u64 = 100_000_000;

    public struct Game has store, drop, copy {
        developer: address,
        name: vector<u8>,
        metadata: vector<u8>,
        submitted_at: u64,
    }

    public struct GameRegistry has key {
        id: UID,
        owner: address,
        games: vector<Game>,
        total_fees_collected: u64,
    }

    // Initialize the game registry
    fun init(ctx: &mut TxContext) {
        let registry = GameRegistry {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            games: std::vector::empty(),
            total_fees_collected: 0,
        };
        transfer::share_object(registry);
    }

    // Submit a game with payment
    public entry fun submit_game(
        registry: &mut GameRegistry,
        name: vector<u8>,
        metadata: vector<u8>,
        mut payment: Coin<OCT>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        // Check if payment is sufficient
        assert!(coin::value(&payment) >= FEE, EInsufficientFee);

        // Split the fee amount
        let fee_coin = coin::split(&mut payment, FEE, ctx);

        // Transfer fee to registry owner
        transfer::public_transfer(fee_coin, registry.owner);

        // Return remaining payment to sender
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        // Create and store the game
        let game = Game {
            developer: tx_context::sender(ctx),
            name,
            metadata,
            submitted_at: clock::timestamp_ms(clock),
        };

        std::vector::push_back(&mut registry.games, game);
        registry.total_fees_collected = registry.total_fees_collected + FEE;
    }

    // View function to get all games
    public fun get_games(registry: &GameRegistry): &vector<Game> {
        &registry.games
    }

    // View function to get total games count
    public fun get_games_count(registry: &GameRegistry): u64 {
        std::vector::length(&registry.games)
    }

    // View function to get total fees collected
    public fun get_total_fees(registry: &GameRegistry): u64 {
        registry.total_fees_collected
    }
}
