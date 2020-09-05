
const State = {
    SETUP,
    YOUR_TURN,
    OPPONENT_TURN,
    
};

export default class Game {
    constructor(props) {
        super(props);

        this.state = {
            current: 
        }
    }

    render() {
        return (
            <div className="game">
                Jaa we zitten in een game JOEPIE!
            </div>
        );
    }
}