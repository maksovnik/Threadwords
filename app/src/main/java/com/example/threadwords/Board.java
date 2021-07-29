package com.example.threadwords;

import android.content.Context;
import android.util.TypedValue;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

public class Board extends LinearLayout {
    int width;
    int height;

    Context context;
    ArrayList<ButtonX> buttons = new ArrayList<ButtonX>();

    List<Character> letters;
    ClickListener clickListener;

    ArrayList<Integer> path = new ArrayList<Integer>();

    public Board(Context context) {
        super(context);

        this.context=context;

        setOrientation(LinearLayout.VERTICAL);

        setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));



    }

    public void setWidth(int width) {
        this.width = width;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void removeButtons(){

        removeAllViews();

        buttons.clear();
    }

    public void buildButtons(){

        LinearLayout r = new LinearLayout(context);
        r.setOrientation(LinearLayout.HORIZONTAL);

        for (int i = 0; i < width*height; i++) {

            ButtonX b = new ButtonX(context);
            buttons.add(b);

            b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f);
            b.setText("X");

            final int finalI = i;
            b.setOnClickListener(e -> setupLogic(finalI));
            b.setHeight(250);

            LinearLayout.LayoutParams test = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
            test.weight = 1;
            b.setLayoutParams(test);


            if(i%width==0){
                System.out.println(i);
                r = new LinearLayout(context);
                r.setOrientation(LinearLayout.HORIZONTAL);
                addView(r);
            }

            r.addView(b);

        }

        resetBoard();

    }

    public void setLetters(List<Character> letters) {
        this.letters = letters;
        for(int i =0;i<letters.size();i++){
            buttons.get(i).setText(""+letters.get(i));
        }
    }

    public ArrayList<ButtonX> getButtons(){
        return buttons;
    }

    public void setOnClick(ClickListener e){
        this.clickListener = e;
    }

    public int columnOf(int i){
        return i%width;
    }

    private void setupLogic(int finalI){

        App.cp.start();
        int column = columnOf(finalI);
        int nextCol = path.size();

        if(!buttons.get(finalI).getIsPossible()||path.contains(finalI)){
            if(column==0){
                path.clear();
            }
            else{
                resetBoard();
                return;
            }
        }

        if((column!=nextCol)&&column!=0){
            return;
        }

        path.add(finalI);

        if(finalI%width==width-1){
            String x = "";
            for(int i : path){
                x = x + letters.get(i);
            }

            if(App.words.contains(x)){
                clickListener.onClick(x);
                System.out.println("Hello");

            }

            resetBoard();
            return;

        }



        for (int u = 0; u < buttons.size(); u++) {
            boolean end = true;

            if ((u % width) <= (finalI % width) && (finalI != u)) {
                end=false;
            }

            if(path.contains(u)){
                end=true;
            }

            buttons.get(u).setIsPossible(end);

        }

        for (int q = finalI; q > 0; q -= (width-1)) {
            int old = q - width;
            while (true) {

                if (old <= 0) {
                    break;
                }

                buttons.get(old).setIsPossible(false);

                old = old - width;

            }
        }

        for (int q = finalI; q < buttons.size(); q += (width+1)){
            int old = q + width;

            while (true) {

                if (old >= buttons.size()) {
                    break;
                }

                buttons.get(old).setIsPossible(false);
                old = old + width;

            }
        }

    }

    private void resetBoard(){
        path.clear();

        for (int y = 0; y < buttons.size(); y++) {
            ButtonX bu = buttons.get(y);
                bu.setIsPossible(true);


        }
    }

}
