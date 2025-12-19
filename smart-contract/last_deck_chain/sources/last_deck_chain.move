// ---------------- MODULE 1: BOSS NFT ----------------
module last_desk::boss_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::display;
    use sui::package::Publisher;


    // Struct NFT Boss
    public struct BossNFT has key, store {
        id: UID,
        name: String,
        stage: u64,
        image_url: String,
        description: String,
    }

    // Hàm lấy metadata (Đã tích hợp link Pinata của bạn)
    fun get_boss_metadata(stage: u64): (String, String) {
        if (stage == 1) {
            (
                string::utf8(b"Crimson Nightmare"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-crimson-nightmare.png")
            )
        } else if (stage == 2) {
            (
                string::utf8(b"Eternal Void"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-eternal-void.png")
            )
        } else if (stage == 3) {
            (
                string::utf8(b"Forgotten King"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-forgotten-king.png")
            )
        } else if (stage == 4) {
            (
                string::utf8(b"Memory Wraith"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-memory-wraith.png")
            )
        } else if (stage == 5) {
            (
                string::utf8(b"Oblivion Lord"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-oblivion-lord.png")
            )
        } else if (stage == 6) {
            (
                string::utf8(b"Shadow Fragment"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-shadow-fragment.png")
            )
        } else if (stage == 7) {
            (
                string::utf8(b"Time Devourer"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-time-devourer.png")
            )
        } else if (stage == 8) {
            (
                string::utf8(b"Void Sentinel"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-void-sentinel.png")
            )
        } else {
            (
                string::utf8(b"Unknown Boss"),
                string::utf8(b"https://jade-labour-goat-295.mypinata.cloud/ipfs/bafybeibgjtoxafvr4nmuaz7rwkflo5fejhxw6ekxzz2tsgka35hjjite3m/boss-crimson-nightmare.png")
            )
        }
    }


    public entry fun init_display(pub: &Publisher, ctx: &mut TxContext){
         // Legacy initializer kept for compatibility; it registers generic placeholders.
         let mut disp = display::new<BossNFT>(pub, ctx);

        display::add(&mut disp, string::utf8(b"name"), string::utf8(b"Unknown Boss"));
        display::add(&mut disp, string::utf8(b"image_url"), string::utf8(b""));
        display::add(&mut disp, string::utf8(b"description"), string::utf8(b""));
        // consume the Display value so it isn't left unused (Display lacks `drop`)
        transfer::public_transfer(disp, tx_context::sender(ctx));
    }

    // Better: initialize display metadata for a specific stage using real metadata
    public entry fun init_display_for_stage(pub: &Publisher, stage: u64, ctx: &mut TxContext) {
        let (boss_name, image_url) = get_boss_metadata(stage);

        let mut disp = display::new<BossNFT>(pub, ctx);
        display::add(&mut disp, string::utf8(b"name"), boss_name);
        display::add(&mut disp, string::utf8(b"image_url"), image_url);
        display::add(&mut disp, string::utf8(b"description"), string::utf8(b"Reward for defeating the stage boss."));

        transfer::public_transfer(disp, tx_context::sender(ctx));
    }

    // Hàm mint NFT
    // public để module khác trong cùng package (hoặc ngoài) có thể gọi
    public fun mint_reward(stage: u64, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let (boss_name, image_url) = get_boss_metadata(stage);

        let nft = BossNFT {
            id: object::new(ctx),
            name: boss_name,
            stage: stage,
            image_url,
            description: string::utf8(b"Reward for defeating the stage boss."),
        };
        // transfer NFT
        transfer::public_transfer(nft, sender);
    }
}

// ---------------- MODULE 2: PLAYER (LOGIC GAME) ----------------
module last_desk::player {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    
    // GỌI MODULE Ở TRÊN VÀO ĐÂY
    use last_desk::boss_nft; 

    public struct PlayerState has key {
        id: UID,
        owner: address,
        level: u64,
        gold: u64,
        seed: u64,
        last_updated: u64,
    }

    // Tạo nhân vật mới
    public entry fun create_player(ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let player = PlayerState {
            id: object::new(ctx),
            owner: owner,
            level: 1,
            gold: 0,
            seed: 0, 
            last_updated: 0,
        };
        sui::transfer::transfer(player, owner);
    }

    // --- HÀM CHIẾN THẮNG & NHẬN NFT ---
    public entry fun win_stage(
        player: &mut PlayerState,
        stage_won: u64,      
        new_level: u64,      
        new_gold: u64,       
        new_seed: u64,       
        timestamp: u64,      
        ctx: &mut TxContext
    ) {
        // 1. Check chủ sở hữu
        assert!(player.owner == tx_context::sender(ctx), 1);

        // 2. Cập nhật chỉ số
        player.level = new_level;
        player.gold = new_gold;
        player.seed = new_seed;
        player.last_updated = timestamp;

        // 3. GỌI MINT NFT TỪ MODULE TRÊN
        boss_nft::mint_reward(stage_won, ctx);
    }

    // Hàm update thông thường (save game)
    public entry fun update_player(
        player: &mut PlayerState,
        level: u64,
        gold: u64,
        seed: u64,
        last_updated: u64,
        ctx: &TxContext
    ) {
        assert!(player.owner == tx_context::sender(ctx), 1);
        player.level = level;
        player.gold = gold;
        player.seed = seed;
        player.last_updated = last_updated;
    }

    public fun get_player(player: &PlayerState): (u64, u64, u64) {
        (player.level, player.gold, player.seed)
    }
}