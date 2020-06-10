import dev.jabo.kree.*;

public class Launcher {

    public static void main(String[] args) {

        Game game = new Game(new Window("My Game", 800, 600));

        GameScene gameScene = new GameScene(game);

        SceneManager.setScene(gameScene);

        // start must always be in the end of the main method
        game.start();

    }
}