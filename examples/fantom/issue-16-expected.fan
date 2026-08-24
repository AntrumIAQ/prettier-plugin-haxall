class Widget
{
  Void configure()
  {
    x := 1

    // Block comment spanning multiple lines should not have its
    // delimiters split apart.
    /*
    y := 2
    z := 3
    */

    // Block comments can nest.
    /*
    a := 1
    /* still commented out */
    b := 2
    */

    w := 4 /* trailing note */
    echo(x)
  }
}
