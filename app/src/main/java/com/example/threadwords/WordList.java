package com.example.threadwords;

import android.content.Context;
import android.graphics.Color;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.w3c.dom.Text;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

public class WordList extends LinearLayout {


    List<String> words;
    Context context;
    ArrayList<TextView> texts = new ArrayList<TextView>();
    ArrayList<LinearLayout> rows = new ArrayList<LinearLayout>();

    public WordList(Context context) {
        super(context);
        setOrientation(LinearLayout.HORIZONTAL);
        this.context=context;

        //LinearLayout.LayoutParams test = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        //setLayoutParams(test);


    }

    public void removeList(){
        for(int i =0;i<rows.size();i++){
            removeView(rows.get(i));
        }
        rows.clear();
        texts.clear();
    }
    public void createList(){

        LinearLayout qe = new LinearLayout(context);
        for (int i = 0; i < words.size(); i++) {

            if (i % 8 == 0) {

                LinearLayout.LayoutParams test = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
                test.weight = 1;

                qe = new LinearLayout(context);
                qe.setOrientation(LinearLayout.VERTICAL);
                rows.add(qe);

                qe.setLayoutParams(test);
                addView(qe);
            }


            TextView xTv = new TextView(context);


            xTv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22f);
            xTv.setGravity(Gravity.CENTER);

            xTv.setBackgroundColor(Color.parseColor("#e0e0e0"));

            texts.add(xTv);

            qe.addView(xTv);
        }


    }

    public void setWords(List<String> words){
        this.words=words;
    }
    public ArrayList<TextView> getTexts(){
        return texts;
    }


}
