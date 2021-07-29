package com.example.threadwords;

import android.content.Context;
import android.graphics.Color;

import androidx.annotation.NonNull;

public class ButtonX extends androidx.appcompat.widget.AppCompatButton {

    boolean isPossible = false;
    public ButtonX(Context context) {
        super(context);
    }


    public void setIsPossible(boolean val){
        isPossible=val;
        if(val==true){
            setTextColor(Color.parseColor("#000000"));
        }
        if(val==false){
            setTextColor(Color.parseColor("#ffffff"));
        }
    }

    public boolean getIsPossible(){
        return isPossible;
    }


}
