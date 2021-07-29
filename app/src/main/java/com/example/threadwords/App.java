package com.example.threadwords;

import android.annotation.SuppressLint;
import android.content.res.AssetManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;


public class App extends AppCompatActivity {

    Board board;
    WordList wordList;

    static ArrayList<String> words = new ArrayList<>();
    List<Character> letters = new ArrayList<>();
    ArrayList<String> found = new ArrayList<>();

    static MediaPlayer mp;
    static MediaPlayer cp;
    static MediaPlayer lp;
    static MediaPlayer wp;

    boolean gameOver = false;
    Button bottomButton;
    int score = 0;
    int level=1;

    static int width=4;
    static int height=5;

    boolean end = false;

    LinearLayout root;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        readFile();

        root = (LinearLayout) findViewById(R.id.view_root3);
        board = new Board(this);

        board.setWidth(width);
        board.setHeight(height);
        board.buildButtons();
        wordList = new WordList(this);
        wordList.setWords(words);
        wordList.createList();

        mp= MediaPlayer.create(getApplicationContext(), R.raw.sound);
        cp= MediaPlayer.create(getApplicationContext(), R.raw.click);
        lp= MediaPlayer.create(getApplicationContext(), R.raw.newlevel);
        wp= MediaPlayer.create(getApplicationContext(), R.raw.win);

        board.setLetters(letters);

        TextView scoreText = (TextView) findViewById(R.id.score);
        TextView levelText = (TextView) findViewById(R.id.level);

        board.setOnClick(word -> {


            if(!found.contains(word)) {
                int val = App.words.indexOf(word);
                wordList.getTexts().get(val).setText(App.words.get(val));
                found.add(word);

                score = score+80;
                scoreText.setText("Score: "+score);

                System.out.println("l2p");

                if((found.size()==words.size())){


                    if(width==8){
                        bottomButton.setText("Good Job, you won!");
                        wp.start();
                        end = true;
                        return;
                    }

                    lp.start();
                    System.out.println("lol");
                    level=level+1;

                    levelText.setText("Level: "+level);

                    width++;
                    board.removeButtons();
                    board.setWidth(width);
                    board.setHeight(height);
                    board.buildButtons();


                    letters.clear();
                    words.clear();
                    gameOver=false;
                    readFile();
                    wordList.removeList();
                    wordList.setWords(words);
                    wordList.createList();
                    board.setLetters(letters);

                }
                else{
                    mp.start();
                }
            }
        });



        root.addView(board);
        root.addView(wordList);

        RelativeLayout r = new RelativeLayout(this);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);

        bottomButton = new Button(this);
        bottomButton.setText("Give Up");
        bottomButton.setLayoutParams(layoutParams);

        bottomButton.setOnClickListener(e -> {
            if(end){
                return;
            }
            if(gameOver){
                width=4;
                score=0;
                level=1;
                scoreText.setText("Score: "+score);
                levelText.setText("Level: "+level);
                board.removeButtons();
                board.setWidth(width);
                board.setHeight(height);
                board.buildButtons();


                letters.clear();
                words.clear();
                gameOver=false;
                readFile();
                wordList.removeList();
                wordList.setWords(words);
                wordList.createList();
                board.setLetters(letters);
                bottomButton.setText("Give Up");
            }
            else{
                ArrayList<TextView> texts = wordList.getTexts();
                for (int q = 0; q < texts.size(); q++) {
                    found.add(words.get(q));
                    texts.get(q).setText(words.get(q));
                }
                gameOver=true;
                bottomButton.setText("New Game");
            }

        });


        r.addView(bottomButton);
        root.addView(r);



    }

    private void readFile() {
        AssetManager assetManager = getAssets();
        try {
            InputStream input = assetManager.open("final"+width+".txt");


            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
            int totalLines = 500;
            Random random = new Random();
            int lineNum = 0;
            int chosen = random.nextInt(totalLines);
            String line = "";
            while (reader.ready()) {
                line = reader.readLine();
                lineNum++;
                if (lineNum == chosen) {
                    break;
                }
            }

            String[] p1 = line.split("#");

            words = new ArrayList<>(Arrays.asList(p1[0].split(",")));

            java.util.Collections.sort(words);
            System.out.println(words);
            for(char c :  p1[1].toCharArray()){
                letters.add(c);
            }

            System.out.println(letters);

        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }





}
