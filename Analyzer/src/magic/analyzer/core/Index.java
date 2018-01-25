package magic;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class Index extends Application {
	
	public static void main(String[] args) {
		launch(args);
	}

	Stage stage;
	int amountCrashes = 0;
	double cumulated = 1.00;
	double averageAll = 0.00;
	double average10 = 0.00;
	double average25 = 0.00;
	double average50 = 0.00;
	
	@Override
	public void start(Stage primaryStage) throws Exception {
		
		stage = new Stage(StageStyle.DECORATED);
		stage.setTitle("MAGIC");
		StackPane root = new StackPane();
		
		// Das Borderpane, in das alles geaddet wird.
		BorderPane rootPane = new BorderPane();
		
		rootPane.setCenter(buildMainPane());
		
		// Zusammenbau der Basispanes
		root.getChildren().add(rootPane);		
		stage.setScene(new Scene(root, 600, 400));	
		stage.show();
		
	}
	
	private Node buildMainPane() throws IOException {
		HBox mainBox = new HBox();
		mainBox.setPadding(new Insets(15));
		mainBox.setSpacing(8.0);
		mainBox.setAlignment(Pos.CENTER);
		
		String textContents = null;
		try {
		
			System.setProperty("https.proxyHost", "proxy.edv.dekra.de"); // or the IP
			System.setProperty("https.proxyPort", "8080");
			Document doc = Jsoup.connect("https://csgomagic.com").userAgent("Mozilla").get(); 
			
			Elements elem = doc.select("style__historyResult___1rGGy");
			String text = elem.text();
//			textContents = doc.select("style__historyResult___1rGGy");
//			textContents = "5.87x";
			String fixedCrash = textContents.replace("x", "");
			Double aktCrash = Double.valueOf(fixedCrash);
			
			amountCrashes++;
			cumulated += aktCrash;
			averageAll = cumulated / amountCrashes;
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		VBox firstRow = new VBox();
		
		Text labelCrash = new Text("Letzter Crash: ");
		Text lastCrash = new Text(textContents);
		
		firstRow.getChildren().add(labelCrash);
		firstRow.getChildren().add(lastCrash);
		
		VBox secondRow = new VBox();
		
		Text labelStats = new Text("Statistics: ");
		Text labelCumulated = new Text("Cumulated: ");
		Text textCumulated = new Text(Double.toString(cumulated));
		Text labelAmoundCrashes = new Text("Amount crashes recorded: ");
		Text textAmountCrashes = new Text(Integer.toString(amountCrashes));
		
		secondRow.getChildren().add(labelStats);
		secondRow.getChildren().add(labelCumulated);
		secondRow.getChildren().add(textCumulated);
		secondRow.getChildren().add(labelAmoundCrashes);
		secondRow.getChildren().add(textAmountCrashes);
		
		
		
		mainBox.getChildren().add(firstRow);
		mainBox.getChildren().add(secondRow);
		HBox.setHgrow(mainBox, Priority.ALWAYS);
		
		return mainBox;
	}

}
