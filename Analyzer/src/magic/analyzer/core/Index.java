package magic.analyzer.core;

import java.io.IOException;
import java.util.Map;

import org.jsoup.Connection;
import org.jsoup.Connection.Method;
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
//			Document doc = Jsoup.connect("https://wtfskins.com/crash").userAgent("Mozilla").get(); 
			String url = "https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.sreg.optional=nickname%2Cemail%2Cfullname%2Cdob%2Cgender%2Cpostcode%2Ccountry%2Clanguage%2Ctimezone&openid.ns.ax=http%3A%2F%2Fopenid.net%2Fsrv%2Fax%2F1.0&openid.ax.mode=fetch_request&openid.ax.type.fullname=http%3A%2F%2Faxschema.org%2FnamePerson&openid.ax.type.firstname=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffirst&openid.ax.type.lastname=http%3A%2F%2Faxschema.org%2FnamePerson%2Flast&openid.ax.type.email=http%3A%2F%2Faxschema.org%2Fcontact%2Femail&openid.ax.required=fullname%2Cfirstname%2Clastname%2Cemail&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=https%3A%2F%2Fcsgomagic.com%2Fapi%2Fauth%2FloginResponse&openid.realm=https%3A%2F%2Fcsgomagic.com";
			Connection.Response resLogin = Jsoup.connect(url).data("steamAccountName", "deagleeye")
					.data("steamPassword", "echo419")
					.method(Method.POST)
					.execute();
			
			Map<String, String> loginCookies = resLogin.cookies();
			
			Document doc = Jsoup.connect("https://csgomagic.com").cookies(loginCookies).userAgent("Mozilla").get();
//			twofactorcode_entry
			
//			Elements elem = doc.select("div.style__rootContainer___3azWQ");
//			String text2 = elem.text();
//			Elements elem2 = doc.select("div.style__historyResult___1rGGy");
//			String text3 = elem2.text();
//			Elements elementsByTag = doc.getElementsByTag("root");
			
//			String text = elem.text();
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
