module game_registry::game_registry {
    use one::coin::{Self, Coin};
    use one::oct::OCT;
    use one::tx_context::{Self, TxContext};
    use one::clock::{Self, Clock};
    use one::transfer;
    use one::object::{Self, UID};

    // Error codes
    const EInsufficientFee: u64 = 0;

    // Fees
    const GAME_FEE: u64 = 100_000_000;  // 0.1 OCT for game submissions
    const PROJECT_FEE: u64 = 50_000_000; // 0.05 OCT for developer project submissions

    public struct Game has store, drop, copy {
        developer: address,
        name: vector<u8>,
        metadata_ipfs_hash: vector<u8>,
        submitted_at: u64,
        submission_type: u8, // 0 = game, 1 = developer project
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

    // Submit a game with payment (0.1 OCT)
    public entry fun submit_game(
        registry: &mut GameRegistry,
        name: vector<u8>,
        metadata_ipfs_hash: vector<u8>,
        mut payment: Coin<OCT>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        // Check if payment is sufficient
        assert!(coin::value(&payment) >= GAME_FEE, EInsufficientFee);

        // Split the fee amount
        let fee_coin = coin::split(&mut payment, GAME_FEE, ctx);

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
            metadata_ipfs_hash,
            submitted_at: clock::timestamp_ms(clock),
            submission_type: 0, // game submission
        };

        std::vector::push_back(&mut registry.games, game);
        registry.total_fees_collected = registry.total_fees_collected + GAME_FEE;
    }

    // Submit a developer project with payment (0.05 OCT)
    public entry fun submit_project(
        registry: &mut GameRegistry,
        name: vector<u8>,
        metadata_ipfs_hash: vector<u8>,
        mut payment: Coin<OCT>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        // Check if payment is sufficient
        assert!(coin::value(&payment) >= PROJECT_FEE, EInsufficientFee);

        // Split the fee amount
        let fee_coin = coin::split(&mut payment, PROJECT_FEE, ctx);

        // Transfer fee to registry owner
        transfer::public_transfer(fee_coin, registry.owner);

        // Return remaining payment to sender
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        // Create and store the project
        let project = Game {
            developer: tx_context::sender(ctx),
            name,
            metadata_ipfs_hash,
            submitted_at: clock::timestamp_ms(clock),
            submission_type: 1, // developer project submission
        };

        std::vector::push_back(&mut registry.games, project);
        registry.total_fees_collected = registry.total_fees_collected + PROJECT_FEE;
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
